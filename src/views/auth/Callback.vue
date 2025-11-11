<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div>
      <h3>Processing sign-in...</h3>
      <p>Please wait.</p>
    </div>
  </div>
</template>

<script>
import { msalInstance } from '@/auth/msalConfig';
import useJwt from '@/auth/jwt/useJwt';
import { getHomeRouteForLoggedInUser } from '@/auth/utils';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import environment from '@/environment'

export default {
  async created() {
    console.log('[Callback] created')
    try {
      const account = msalInstance.getActiveAccount();
      if (!account) {
        console.warn('[Callback] No active account; staying on /oauth')
        return
      }

      // Try to get tokens silently (Graph/basic identity)
      const authResult = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read', 'openid', 'profile', 'email'],
        account,
      });
      console.log('[Callback] acquireTokenSilent ok', {
        hasIdToken: !!authResult.idToken,
        hasAccessToken: !!authResult.accessToken,
      })

      // Extract common claims from id_token for backend convenience
      let claims = {}
      try {
        const parts = (authResult.idToken || '').split('.')
        if (parts.length === 3) {
          claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        }
      } catch (e) {
        // ignore claim parsing errors
      }

      // Prepare payload for backend authentication
      const payload = {
        grant_type: 'azure',
        provider: 'microsoft',
        idToken: authResult.idToken,
        accessToken: authResult.accessToken,
        upn: account.username,
        name: account.name,
        tenantId: claims.tid,
        oid: claims.oid,
        email: claims.email || claims.preferred_username,
      };

      // Acquire access token for your protected API (audience from environment)
      // Adjusted to use environment-based App ID URI and scope name
      const appIdUri = environment.azureApiAppIdUri
      const scopeName = environment.azureApiScopeName || 'user_impersonation'
      const apiScopesPrimary = [`${appIdUri}/${scopeName}`]
      const apiScopesFallback = [`${appIdUri}/.default`]
      let apiAccessToken = null
      // Detect previous invalid_resource (500011) to avoid redirect loop
      const hashStr = window.location.hash || ''
      const hashParams = new URLSearchParams(hashStr.replace(/^#/, ''))
      const msalErr = (hashParams.get('error') || '').toLowerCase()
      const msalErrDesc = decodeURIComponent(hashParams.get('error_description') || '').toLowerCase()
      const priorSkip = sessionStorage.getItem('msal.skipApiScopes') === '1'
      const shouldSkipApiScopes = priorSkip || msalErr.includes('invalid_resource') || msalErrDesc.includes('500011') || msalErrDesc.includes('invalid_resource')
      if (shouldSkipApiScopes) {
        sessionStorage.setItem('msal.skipApiScopes', '1')
      } else {
        try {
          const apiRes = await msalInstance.acquireTokenSilent({ scopes: apiScopesPrimary, account })
          apiAccessToken = apiRes.accessToken
        } catch (e1) {
          try {
            const apiRes2 = await msalInstance.acquireTokenSilent({ scopes: apiScopesFallback, account })
            apiAccessToken = apiRes2.accessToken
          } catch (e2) {
            // Attempt interactive consent for API scopes only once to avoid loops
            const prompted = sessionStorage.getItem('msal.promptedApiScopes') === '1'
            if (!prompted) {
              sessionStorage.setItem('msal.promptedApiScopes', '1')
              try {
                await msalInstance.acquireTokenRedirect({ scopes: apiScopesPrimary, redirectUri: `${window.location.origin}/oauth`, account })
                return // After redirect, this code will run again and silent call should succeed
              } catch (e3) {
                console.error('[AUTH] Failed to acquire API token', e1, e2, e3)
              }
            } else {
              // Mark skip to prevent further attempts in this session
              sessionStorage.setItem('msal.skipApiScopes', '1')
            }
          }
        }
      }

      // No backend exchange needed; continue with MSAL session only
      console.log('[AUTH] Skipping backend exchange; proceeding with MSAL tokens only')

      // Prefer the Microsoft API access token for Authorization header (middleware validates MS tokens)
      if (!apiAccessToken || apiAccessToken === 'null' || apiAccessToken === 'undefined' || apiAccessToken === '') {
        console.warn('[AUTH] No API access token for audience api://8c72... — continuing without API token')
        // Fall back for dev: use Graph/id tokens if allowed
        if (environment.devAllowMsalTokenAsAccess) {
          apiAccessToken = authResult.accessToken || authResult.idToken
        }
      }

      // Restaurar licencia/fechaCorte guardados antes del redirect
      try {
        const savedBank = JSON.parse(localStorage.getItem('app.selectedBank'))
        const savedFecha = JSON.parse(localStorage.getItem('app.fechaCorte'))
        if (savedBank) this.$store.commit('app/UPDATE_BANK', savedBank)
        if (savedFecha) this.$store.commit('app/UPDATE_FECHA_CORTE', savedFecha)
      } catch (e) {
        // ignore restore errors
      }

      // Build saved user matching requested structure and fields
      const appToken = apiAccessToken || authResult.accessToken || authResult.idToken
      const nowIso = new Date().toISOString()
      const userId = payload.oid || account.localAccountId || (account.homeAccountId ? account.homeAccountId.split('.')[0] : '')
      const email = payload.email || account.username || ''
      const savedUser = {
        error: false,
        tokenType: 'Bearer',
        accessToken: appToken,
        refreshToken: appToken,
        // Flat-level ability (some parts of app read from here)
        ability: [
          { action: 'manage', subject: 'all' },
        ],
        userData: {
          userId,
          fullName: account?.name || 'User',
          username: account?.username || email || 'user',
          photo: '',
          email,
          role: 'User',
          authenticated: true,
          idCentro: (this.$store?.state?.app?.selectedBank && (this.$store.state.app.selectedBank.id || this.$store.state.app.selectedBank.value)) || 0,
          createdDate: nowIso,
          error: false,
          access: [],
          ability: [
            { action: 'manage', subject: 'all' },
          ],
        },
      }

      // Ensure nested userData exists and enrich with MSAL account info when backend is sparse
      if (!savedUser.userData || typeof savedUser.userData !== 'object') {
        savedUser.userData = {}
      }
      // Token duplication inside nested userData
      savedUser.userData.accessToken = savedUser.accessToken
      savedUser.userData.refreshToken = savedUser.refreshToken
      if (!savedUser.userData.fullName || savedUser.userData.fullName === 'Anonymous') {
        savedUser.userData.fullName = account?.name || savedUser.userData.fullName || 'User'
      }
      if (!savedUser.userData.username || savedUser.userData.username === 'Anonymous') {
        savedUser.userData.username = (account?.username) || (payload?.email) || savedUser.userData.username || 'user'
      }
      if (!savedUser.userData.role) {
        savedUser.userData.role = 'administrador'
      }
      // leave other optional fields as provided by backend
      // Mirror ability at nested level too for components expecting it there
      if (!savedUser.userData.ability) {
        savedUser.userData.ability = savedUser.ability || []
      }

      // Persist session (same keys as password login) — set Authorization header to MS API token
      useJwt.setToken(savedUser.accessToken)
      // Normalize username to strip IdP prefix and email domain before saving
      try {
        const normalizeUsername = (u) => {
          if (!u || typeof u !== 'string') return u
          let s = u
          if (s.includes('#')) s = s.split('#').pop()
          if (s.includes('@')) s = s.split('@')[0]
          return s
        }
        const baseUser = (savedUser.userData && savedUser.userData.username)
          || savedUser.username
          || (payload?.email)
          || account?.username
        const shortUser = normalizeUsername(baseUser)
        if (shortUser) {
          if (!savedUser.userData || typeof savedUser.userData !== 'object') savedUser.userData = {}
          savedUser.userData.username = shortUser
          savedUser.username = shortUser
        }
      } catch (e) { /* ignore */ }
      // Attach MSAL metadata for debugging/visibility. Note: MSAL does NOT expose refresh token in browser.
      try {
        savedUser.msal = {
          idToken: authResult.idToken || '',
          scopes: authResult.scopes || [],
          accessTokenExpiresOn: (authResult.expiresOn && authResult.expiresOn.toISOString && authResult.expiresOn.toISOString()) || null,
          tenantId: payload.tenantId || null,
          oid: payload.oid || null,
        }
      } catch (e) { /* ignore */ }
      localStorage.setItem('userData', JSON.stringify(savedUser))
      console.log('[AUTH] Session persisted to localStorage', { hasToken: true, hasUserData: true, role: savedUser?.userData?.role })
      try { if (this.$ability && typeof this.$ability.update === 'function') this.$ability.update(savedUser.ability || []) } catch (_) {}

      // Navigate to home route based on role (same as password login)
      const role = savedUser?.userData?.role || 'user'
      try {
        await this.$router.replace(getHomeRouteForLoggedInUser(role))
      } catch (navErr) {
        console.warn('[AUTH] Navigation failed, forcing dashboard', navErr)
        try { await this.$router.replace({ name: 'atom-dashboard' }) } catch (_) {}
      }

      this.$toast({
        component: ToastificationContent,
        position: 'top-right',
        props: {
          title: `Bienvenido ${savedUser?.userData?.fullName || account.name}`,
          icon: 'CoffeeIcon',
          variant: 'Info',
          text: 'Inicio de sesión exitoso con Microsoft.',
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Azure sign-in processing failed:', err);
      // stay on /oauth for troubleshooting
    }
  },
};
</script>
