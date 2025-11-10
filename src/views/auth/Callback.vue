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
        console.warn('[Callback] No active account, redirecting to success for diagnostics')
        // If for any reason MSAL has no account, show success screen for debugging
        return this.$router.replace({ name: 'auth-success' })
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
                await msalInstance.acquireTokenRedirect({ scopes: apiScopesPrimary, redirectUri: `${window.location.origin}/auth/callback`, account })
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

      // Exchange Microsoft tokens for application JWT (for user profile/ability)
      console.log('[AUTH] Sending Microsoft payload to backend', { upn: payload.upn, tenantId: payload.tenantId, hasIdToken: !!payload.idToken, hasAccessToken: !!payload.accessToken })
      const { data } = await this.$http.post(`${environment.uri}/usuarios/autenticacion`, payload);
      console.log('[AUTH] Backend auth response', data)

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

      // Build saved user to mirror username/password login EXACTLY
      const savedUser = { ...data, ability: data?.userData?.ability || [] }
      const refreshToken = data?.refreshToken || null
      // Duplicate tokens both at top-level and inside nested userData per request
      // Use the MS API token as the app Authorization token so middleware accepts it
      savedUser.accessToken = apiAccessToken || authResult.accessToken || authResult.idToken
      savedUser.refreshToken = refreshToken
      if ('error' in savedUser) delete savedUser.error

      // Ensure nested userData exists and enrich with MSAL account info when backend is sparse
      if (!savedUser.userData || typeof savedUser.userData !== 'object') {
        savedUser.userData = {}
      }
      // Token duplication inside nested userData
      savedUser.userData.accessToken = apiAccessToken || authResult.accessToken || authResult.idToken
      savedUser.userData.refreshToken = refreshToken
      if (!savedUser.userData.fullName || savedUser.userData.fullName === 'Anonymous') {
        savedUser.userData.fullName = account?.name || savedUser.userData.fullName || 'User'
      }
      if (!savedUser.userData.username || savedUser.userData.username === 'Anonymous') {
        savedUser.userData.username = (account?.username) || (payload?.email) || savedUser.userData.username || 'user'
      }
      if (!savedUser.userData.role) {
        savedUser.userData.role = data?.userData?.role || 'user'
      }
      // leave other optional fields as provided by backend
      // Mirror ability at nested level too for components expecting it there
      if (!savedUser.userData.ability) {
        savedUser.userData.ability = savedUser.ability || []
      }

      // Persist session (same keys as password login) — set Authorization header to MS API token
      useJwt.setToken(apiAccessToken || authResult.accessToken || authResult.idToken)
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
          || payload?.email
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
      console.log('[AUTH] Session persisted to localStorage', { hasToken: true, hasUserData: true, role: data?.userData?.role })
      this.$ability.update(savedUser.ability || [])

      // Navigate to home route based on role (same as password login)
      const role = data?.userData?.role || 'user'
      await this.$router.replace(getHomeRouteForLoggedInUser(role))

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
      // If backend exchange fails, fall back to success page to show MSAL data
      // eslint-disable-next-line no-console
      console.error('Azure sign-in exchange failed:', err);
      this.$router.replace({ name: 'auth-success', query: { error: 'exchange_failed' } })
    }
  },
};
</script>
