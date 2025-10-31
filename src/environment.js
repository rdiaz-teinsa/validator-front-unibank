const apiBase = (process.env.VUE_APP_API_BASE || '').replace(/\/+$/, '')

export default {
  uri: apiBase,
  version: '1.1.5',
}
