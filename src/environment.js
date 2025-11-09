let apiBase = (process.env.VUE_APP_API_BASE || '').replace(/\/+$/, '')

// Default to same-origin with "/apis" path instead of using an "apis." subdomain
if (!apiBase) {
  if (typeof window !== 'undefined' && window.location) {
    const { origin } = window.location
    apiBase = `${origin}/apis`
  } else {
    // Fallback for non-browser contexts
    apiBase = '/apis'
  }
}
export default {
  uri: apiBase,
  version: '1.1.5',

  // Dev-only: allow using MSAL tokens as app accessToken when backend returns null
  // Useful on localhost while backend Azure exchange is not wired.
  devAllowMsalTokenAsAccess: true,
  // Azure AD config (make it easy to switch tenants/apps)
  azureTenantId: 'cf2a7612-3a84-4aac-a4cf-b029e6178dbe',
  azureClientId: '8c72f1e3-25f2-4335-bf89-16afbbf24f9e',
  // The Application ID URI of your protected API
  azureApiAppIdUri: 'api://8c72f1e3-25f2-4335-bf89-16afbbf24f9e',
  // The scope name exposed by your API (e.g., 'user_impersonation')
  azureApiScopeName: 'user_impersonation',
  // Optional: override redirectUri if needed per environment
  // azureRedirectUri: 'http://localhost:4000/auth/callback',
}
