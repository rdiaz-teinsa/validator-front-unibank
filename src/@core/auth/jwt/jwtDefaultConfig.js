import environment from '@/environment'

export default {
  // Endpoints
  loginEndpoint: `${environment.uri}/usuarios/autenticacion`,
  registerEndpoint: '/jwt/register',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
}
