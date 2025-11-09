import { PublicClientApplication } from '@azure/msal-browser';
import environment from '@/environment'

// Configuración de MSAL
export const msalConfig = {
    auth: {
        // Application (client) ID
        clientId: environment.azureClientId,

        // Authority built from tenant ID
        authority: `https://login.microsoftonline.com/${environment.azureTenantId}`,

        // Redirect back to the callback route to perform backend auth exchange
        // Ensure this URI is added to your Azure App Registration Redirect URIs.
        redirectUri: (environment.azureRedirectUri || 'http://localhost:4000/auth/callback'),
        // Stay on the redirect URI after processing response (don't navigate back to /login)
        navigateToLoginRequestUrl: false,
    },
    cache: {
        // Persist MSAL cache in localStorage to survive full-page redirects
        // and avoid losing auth state during the callback → mount sequence.
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
};

// Permisos que solicitas (ya los listaste)
export const loginRequest = { scopes: ['User.Read'] };

// Crea la instancia de MSAL
export const msalInstance = new PublicClientApplication(msalConfig);
