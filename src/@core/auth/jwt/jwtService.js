import jwtDefaultConfig from './jwtDefaultConfig'
import environment from '@/environment'
import router from '@/router'
import { msalInstance } from '@/auth/msalConfig'

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }
  subscribers = []
  isRefreshing = false

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      config => {
        // Get token from localStorage
        const accessToken = this.getToken()

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          const prefix = (this.jwtConfig.tokenType || '').trim()
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = prefix ? `${prefix} ${accessToken}` : `${accessToken}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      response => response,
      error => {
        let apiMessage = 'El sistema no esta disponible, intentalo mas tarde'
        const { response, config: originalRequest } = error
        if (response && response.status === 401) {
          const isPublicRoute = router.currentRoute && (
            (router.currentRoute.matched && router.currentRoute.matched.some(r => r.meta && r.meta.public === true)) ||
            (router.currentRoute.path && router.currentRoute.path.startsWith('/auth/'))
          )

          // Try token refresh flow once per request
          if (!originalRequest._retry) {
            originalRequest._retry = true

            const attemptMsalRefresh = () => this.refreshMsalAccessToken()
              .then(newAccessToken => {
                if (!newAccessToken) return null
                const prefix = (this.jwtConfig.tokenType || '').trim()
                originalRequest.headers.Authorization = prefix ? `${prefix} ${newAccessToken}` : `${newAccessToken}`
                return this.axiosIns(originalRequest)
              })

            const attemptBackendRefresh = () => this.refreshAccessToken()
              .then(newAccessToken => {
                if (!newAccessToken) throw new Error('No new access token from refresh')
                const prefix = (this.jwtConfig.tokenType || '').trim()
                originalRequest.headers.Authorization = prefix ? `${prefix} ${newAccessToken}` : `${newAccessToken}`
                return this.axiosIns(originalRequest)
              })

            if (this.isRefreshing) {
              // Queue until refresh completes
              return new Promise(resolve => {
                this.addSubscriber(token => {
                  const prefix = (this.jwtConfig.tokenType || '').trim()
                  originalRequest.headers.Authorization = prefix ? `${prefix} ${token}` : `${token}`
                  resolve(this.axiosIns(originalRequest))
                })
              })
            }

            this.isRefreshing = true
            return attemptMsalRefresh()
              .then(res => {
                if (res) return res
                // If MSAL path didn’t yield a token, try backend refresh path
                return attemptBackendRefresh()
              })
              .then(res => res)
              .catch(err => {
                // If refresh fails, handle logout for non-public routes (unless dev bypass)
                const devAuthBypass = !!environment.devAllowMsalTokenAsAccess
                if (!isPublicRoute && !devAuthBypass) {
                  try { localStorage.clear() } catch (e) {}
                  router.replace('/login')
                }
                return Promise.reject(err)
              })
              .finally(() => {
                this.isRefreshing = false
              })
          }

          // If we already retried and still 401, fall through to logout behavior
          const devAuthBypass = !!environment.devAllowMsalTokenAsAccess
          if (!isPublicRoute && !devAuthBypass) {
            try { localStorage.clear() } catch (e) {}
            router.replace('/login')
          }
        }

        if (response && response.data) {
          apiMessage = response.data.error
        }

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ ...error, apiMessage })
      },
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  // Attempt to refresh token using refreshToken stored in localStorage.userData
  async refreshAccessToken() {
    try {
      // Get refresh token from userData (top-level or nested)
      const raw = localStorage.getItem('userData')
      const parsed = raw ? JSON.parse(raw) : null
      const refreshToken = parsed?.refreshToken || parsed?.userData?.refreshToken || null
      if (!refreshToken) return null

      // Prefer configured refresh endpoint
      const primaryEndpoint = this.jwtConfig.refreshEndpoint || '/jwt/refresh-token'
      let data
      try {
        ({ data } = await this.axiosIns.post(primaryEndpoint, { refreshToken }))
      } catch (primaryErr) {
        // Fallback to mock endpoint if available (useful in dev / fake-db)
        if (primaryEndpoint !== '/jwt/refresh-token') {
          try {
            ({ data } = await this.axiosIns.post('/jwt/refresh-token', { refreshToken }))
          } catch (fallbackErr) {
            throw primaryErr
          }
        } else {
          throw primaryErr
        }
      }
      const newAccessToken = data?.accessToken || data?.token || data?.jwt || null
      const newRefreshToken = data?.refreshToken || refreshToken
      if (!newAccessToken) return null

      // Persist new tokens
      this.setToken(newAccessToken)
      // Duplicate into userData as well
      const updated = parsed || {}
      updated.accessToken = newAccessToken
      updated.refreshToken = newRefreshToken
      if (!updated.userData || typeof updated.userData !== 'object') updated.userData = {}
      updated.userData.accessToken = newAccessToken
      updated.userData.refreshToken = newRefreshToken
      localStorage.setItem('userData', JSON.stringify(updated))

      // Notify queued requests
      this.onAccessTokenFetched(newAccessToken)
      return newAccessToken
    } catch (e) {
      // Notify queued requests so they don't hang
      try { this.onAccessTokenFetched(null) } catch (e2) {}
      return null
    } finally {
      // Clear subscribers after notifying
      this.subscribers = []
    }
  }

  // Attempt to refresh Microsoft API access token using MSAL (SPA-only)
  async refreshMsalAccessToken() {
    try {
      const account = msalInstance.getActiveAccount()
      if (!account) return null
      // Prefer API scope; fallback to .default if necessary
      const appIdUri = environment.azureApiAppIdUri
      const scopeName = environment.azureApiScopeName || 'user_impersonation'
      const apiScopesPrimary = [`${appIdUri}/${scopeName}`]
      const apiScopesFallback = [`${appIdUri}/.default`]
      let result
      try {
        result = await msalInstance.acquireTokenSilent({ scopes: apiScopesPrimary, account })
      } catch (e1) {
        try {
          result = await msalInstance.acquireTokenSilent({ scopes: apiScopesFallback, account })
        } catch (e2) {
          return null
        }
      }
      const newAccessToken = result && result.accessToken
      if (!newAccessToken) return null

      // Persist new token
      this.setToken(newAccessToken)

      // Duplicate into userData for visibility
      const raw = localStorage.getItem('userData')
      const parsed = raw ? JSON.parse(raw) : {}
      parsed.accessToken = newAccessToken
      if (!parsed.userData || typeof parsed.userData !== 'object') parsed.userData = {}
      parsed.userData.accessToken = newAccessToken
      localStorage.setItem('userData', JSON.stringify(parsed))

      // Notify queued requests
      this.onAccessTokenFetched(newAccessToken)
      return newAccessToken
    } catch (e) {
      return null
    }
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  login(...args) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return this.axiosIns.post(this.jwtConfig.registerEndpoint, ...args)
  }
}
