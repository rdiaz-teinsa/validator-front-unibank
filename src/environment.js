export default {
  uri: 'https://apis.tval.online',
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
