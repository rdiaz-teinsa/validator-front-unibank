import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils'
import atoms from './routes/atoms'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'atom-dashboard' } },
    ...atoms, // atoms.js contains the /auth/callback route
    {
      path: '*',
      redirect: 'error-404',
    },
    // The duplicate /auth/callback route has been REMOVED from here
  ],
})

router.beforeEach((to, _, next) => {
  try { console.log('[NAV] to:', to.fullPath) } catch (e) {}
  const isLoggedIn = isUserLoggedIn()

  // Allow public routes to bypass ACL and auth checks
  if (to.matched.some(route => route.meta && route.meta.public === true) || to.path.startsWith('/auth/')) {
    try { console.log('[NAV] public route bypass:', to.fullPath) } catch (e) {}
    return next()
  }

  // This check is good. If the route is public (like /auth/callback),
  // canNavigate(to) should return true.
  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      try { console.log('[NAV] blocked by ACL; redirecting to login') } catch (e) {}
      return next({ name: 'atoms-auth-login' })
    }

    // If logged in => not authorized
    return next({ name: 'misc-not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()
    return next({ ...getHomeRouteForLoggedInUser(userData ? userData.role : null), replace: true })
  }

  // --- THE FIX IS HERE ---
  // We must also check for '/auth/callback'
  if (store.state.app.selectedBank === null &&
      to.path !== '/' &&
      to.path !== '/login' &&
      to.path !== '/auth/callback' && // <-- exception for msal callback
      to.path !== '/auth/success' && // <-- exception for msal success view
      to.path !== '/atoms/dashboard' // <-- allow dashboard to show its own setup modal
  ) {
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) appLoading.style.display = 'none'

    alert('Debe colocar un licencia y una fecha de corte')
    try { console.log('[NAV] missing licencia/fecha; redirecting to atom-dashboard') } catch (e) {}
    return next({ name: 'atom-dashboard', replace: true })
  }
  else {
    try { console.log('[NAV] allow:', to.fullPath) } catch (e) {}
    return next()
  }
})

// ? For splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
