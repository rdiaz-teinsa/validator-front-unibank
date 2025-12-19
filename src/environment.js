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
  // uri: 'http://localhost:7443/apis',
  // uri: 'https://unibank.tval.online/apis',
  version: '1.1.5',

  // Dev-only: allow using MSAL tokens as app accessToken when backend returns null
  // Useful on localhost while backend Azure exchange is not wired.
  devAllowMsalTokenAsAccess: true,
  // Azure AD config (make it easy to switch tenants/apps)
  azureTenantId: 'b9ae648a-1d14-45bd-a2b0-0e196e8a6678',
  azureClientId: '91fcb762-c31f-48ef-a095-c7b17651c8ae',
  // The Application ID URI of your protected API
  azureApiAppIdUri: 'api://91fcb762-c31f-48ef-a095-c7b17651c8ae',
  // The scope name exposed by your API (e.g., 'user_impersonation')
  azureApiScopeName: 'user_impersonation',
  // Optional: override redirectUri if needed per environment
  // azureRedirectUri: 'http://localhost:4000/auth/callback',
}