import useJwt from '@/auth/jwt/useJwt'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  const user = localStorage.getItem('userData')
  const token = localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
  // Ensure token exists and is not a falsy-string like "null"/"undefined"
  const hasValidToken = !!(token && token !== 'null' && token !== 'undefined' && token !== '')
  return !!(user && hasValidToken)
}

export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  console.log('userRole: ', userRole)
  if (userRole === 'administrador') return { name: 'atom-dashboard' }
  if (userRole === 'quest') return { name: 'atom-dashboard' }
  if (userRole === 'client') return { name: 'access-control' }
  // Default to dashboard for unknown/guest roles
  return { name: 'atom-dashboard' }
}
