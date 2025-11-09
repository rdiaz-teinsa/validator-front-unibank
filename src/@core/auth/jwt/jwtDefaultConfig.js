import environment from '@/environment'

export default {
  // Endpoints
  loginEndpoint: `${environment.uri}/usuarios/autenticacion`,
  refreshEndpoint: `${environment.uri}/usuarios/refresh`,
  registerEndpoint: '/jwt/register',
  logoutEndpoint: '/jwt/logout',

  // Prefix for Authorization header
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
}
