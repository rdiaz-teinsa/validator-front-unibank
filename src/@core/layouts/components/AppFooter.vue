<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      COPYRIGHT  © {{ new Date().getFullYear() }}
      <b-link
        class="ml-25"
        href="https://teinsa-pa.com"
        target="_blank"
      >Tecnología Inteligente S.A.</b-link>
      <span class="d-none d-sm-inline-block">, Todos los Derechos Reservados</span>
    </span>

  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'

export default {
  components: {
    BLink,
  },
}
</script>
