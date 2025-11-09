<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh; padding: 2rem;">
    <b-card style="max-width: 720px; width: 100%;">
      <b-card-title>Microsoft Sign-in Result</b-card-title>
      <b-card-text v-if="error" class="text-danger">{{ error }}</b-card-text>

      <div v-if="account">
        <b-row>
          <b-col cols="12" md="6">
            <p><strong>Name:</strong> {{ account.name }}</p>
            <p><strong>Username (UPN):</strong> {{ account.username }}</p>
          </b-col>
          <b-col cols="12" md="6">
            <p><strong>Tenant:</strong> {{ tenantId }}</p>
            <p><strong>Object ID (oid):</strong> {{ oid }}</p>
          </b-col>
        </b-row>

        <b-card class="mt-2">
          <b-card-title class="mb-1">Tokens</b-card-title>
          <p class="mb-50"><strong>ID Token:</strong></p>
          <code class="d-block text-truncate" style="white-space: pre-wrap; word-break: break-all;">{{ idToken || 'N/A' }}</code>
          <p class="mt-1 mb-50"><strong>Access Token (Graph):</strong></p>
          <code class="d-block text-truncate" style="white-space: pre-wrap; word-break: break-all;">{{ accessToken || 'N/A' }}</code>
        </b-card>
      </div>

      <div v-else>
        <p>Processing Microsoft account...</p>
      </div>

      <div class="mt-2 d-flex">
        <b-button variant="primary" class="mr-1" @click="goHome">Go Home</b-button>
        <b-button variant="outline-danger" @click="logout">Logout</b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import { msalInstance } from '@/auth/msalConfig'

export default {
  data() {
    return {
      account: null,
      idToken: '',
      accessToken: '',
      tenantId: '',
      oid: '',
      error: '',
    }
  },
  async created() {
    try {
      const account = msalInstance.getActiveAccount()
      if (!account) {
        this.error = 'No active Microsoft account found.'
        return
      }
      this.account = account

      // Try to acquire tokens silently for display
      const result = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read', 'openid', 'profile', 'email'],
        account,
      })

      this.idToken = result.idToken || ''
      this.accessToken = result.accessToken || ''

      // Try to parse a few claims from id_token if present
      try {
        const parts = (this.idToken || '').split('.')
        if (parts.length === 3) {
          const claims = JSON.parse(atob(parts[1]))
          this.tenantId = claims.tid || claims.tid || ''
          this.oid = claims.oid || ''
        }
      } catch (e) {
        // ignore parsing errors
      }
    } catch (err) {
      this.error = 'Failed to retrieve Microsoft tokens.'
      // eslint-disable-next-line no-console
      console.error(err)
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async logout() {
      try {
        await msalInstance.logout()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
      this.$router.replace('/login')
    },
  },
}
</script>

<style scoped>
</style>
