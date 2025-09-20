<template>
  <b-card
    v-if="data"
    no-body
    class="card-statistics card-background"
  >
    <b-card-header>
      <b-card-title>Estadísticas</b-card-title>
      <b-card-text class="font-small-2 mr-25 mb-0 text-primary">
        Última Actualización 2/2/2022 16:51
      </b-card-text>
    </b-card-header>
    <b-card-body class="statistics-body">
      <b-row>
        <b-col
          v-for="item in data"
          :key="item.icon"
          xl="4"
          sm="4"
          :class="item.customClass"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="64"
                :variant="item.color"
              >
                <feather-icon
                  size="38"
                  :icon="item.icon"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h3 class="font-weight-bolder mb-0">
                {{ item.title }}
              </h3>
              <b-card-text class="font-small-4 mb-0">
                {{ item.subtitle }}
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BRow, BCol, BMedia, BMediaAside, BAvatar, BMediaBody,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
<style>
.card-background{
  background-image: url('/statsbk.png');
  background-size: cover;
}
</style>
