<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">{{ displayUser.fullName || displayUser.username }}</p>
        <span class="user-status">{{ displayUser.role }}</span>
      </div>
      <b-avatar
        v-if="avatarSrc"
        size="40"
        :src="avatarSrc"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      />
      <b-avatar
        v-else
        size="40"
        variant="light-primary"
        badge
        class="badge-minimal d-flex align-items-center justify-content-center"
        badge-variant="success"
      >
        <feather-icon icon="UserIcon" size="22" />
      </b-avatar>
    </template>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout"
    >
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50"
      />
      <span>Salir</span>
    </b-dropdown-item></b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import { initialAbility } from '@/libs/acl/config'
import useJwt from '@/auth/jwt/useJwt'
import { avatarText } from '@core/utils/filter'

import persistanceConfig from '@/store/persistance.config'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
      avatarText,
    }
  },
  computed: {
    // Support both shapes: flat fields or nested under userData
    displayUser() {
      const raw = this.userData || {}
      const nested = (raw && raw.userData && typeof raw.userData === 'object') ? raw.userData : {}
      return { ...raw, ...nested }
    },
    avatarSrc() {
      // Only use explicit avatar; ignore `photo`. Fall back to icon otherwise.
      const candidate = this.displayUser.avatar || ''
      if (typeof candidate !== 'string') return ''
      const trimmed = candidate.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('data:image/')) return trimmed
      if (/^https?:\/\//i.test(trimmed)) return trimmed
      return ''
    }
  },
  methods: {
    logout() {
      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(persistanceConfig.storageKey)

      // Remove userData from localStorage
      localStorage.removeItem('userData')

      // Reset app-scoped selections
      try {
        this.$store && this.$store.commit('app/UPDATE_BANK', null)
        this.$store && this.$store.commit('app/UPDATE_FECHA_CORTE', null)
      } catch (e) {}

      // Reset ability
      this.$ability.update(initialAbility)

      // Redirect to login page
      this.$router.replace({ name: 'atoms-auth-login' })
    },
  },
}
</script>
