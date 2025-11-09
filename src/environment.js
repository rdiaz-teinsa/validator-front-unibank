export default {
  uri: 'https://apis.tval.online',
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
