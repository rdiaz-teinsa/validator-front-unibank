let apiBase = (process.env.VUE_APP_API_BASE || '').replace(/\/+$/, '')

// Default to same-origin with "/apis" path instead of using an "apis." subdomain
if (!apiBase) {
  if (typeof window !== 'undefined' && window.location) {
    const { origin } = window.location
    apiBase = `${origin}/apis`
  } else {
    // Fallback for non-browser contexts
    apiBase = '/apis'
  }
}

export default {
  uri: apiBase,
  version: '1.1.5',
}
