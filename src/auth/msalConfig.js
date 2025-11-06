import { PublicClientApplication } from '@azure/msal-browser';

// Configuración de MSAL
export const msalConfig = {
    auth: {
        // Tu Client ID (Application ID)
        clientId: '8c72f1e3-25f2-4335-bf89-16afbbf24f9e',

        // Tu Tenant ID. Forma la URL de autoridad así:
        authority: 'https://login.microsoftonline.com/cf2a7612-3a84-4aac-a4cf-b029e6178dbe',

        // Tu Redirect URI. (Nota: Corregí el doble slash "//" a uno solo "/")
        redirectUri: 'https://unibank.tval.online/auth/callback',
    },
    cache: {
        cacheLocation: 'sessionStorage', // O 'localStorage'
        storeAuthStateInCookie: false,
    },
};

// Permisos que solicitas (ya los listaste)
export const loginRequest = {
    scopes: ['User.Read'],
};

// Crea la instancia de MSAL
export const msalInstance = new PublicClientApplication(msalConfig);