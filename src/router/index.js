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
    ...atoms, // atoms.js now correctly contains the callback route
    {
      path: '*',
      redirect: 'error-404',
    },
    // The duplicate /auth/callback route has been REMOVED from here
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()
  console.log('router.currentRoute.value: ', _)

  // --- FIX FOR CALLBACK ---
  // We must allow navigation to the public callback route
  if (to.name === 'auth-callback') {
    return next()
  }
  // --- END FIX ---

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'atoms-auth-login' })

    // If logged in => not authorized
    return next({ name: 'misc-not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
  }
  console.log(store.state.app.selectedBank)
  if (store.state.app.selectedBank === null && to.path !== '/' && to.path !== '/login' && to.path !== '/auth/callback') { // Added callback to exception
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) appLoading.style.display = 'none'
    alert('Debe colocar un licencia y una fecha de corte')
    return next('/')
  }
  else {
    return next()
  }
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router