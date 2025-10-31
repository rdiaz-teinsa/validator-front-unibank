let apiBase = (process.env.VUE_APP_API_BASE || '').replace(/\/+$/, '')

// If not set in .env, default to subdomain-relative: https://apis.<current-host>
if (!apiBase && typeof window !== 'undefined' && window.location) {
  const { protocol, host } = window.location
  const subdomainHost = host.startsWith('apis.') ? host : `apis.${host}`
  apiBase = `${protocol}//${subdomainHost}`
}

export default {
  uri: apiBase,
  version: '1.1.5',
}
