<template>
  <b-card
    v-if="data"
    no-body
    class="card-statistics"
  >
    <b-card-body class="statistics-body">
      <b-row>
        <b-col cols="6"
          v-for="item in data"
          :key="item.icon"
          md="2"
          xl="2"
          sm="4"
          :class="item.customClass"
        >
          <img :src="`/productsIcons/${item.icon}`" class="productIcons">
          <div class="productName">{{item.name}}</div>
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
  background-image: url('~@/../public/statsbk.png');
  background-size: cover;
}
.productIcons{
  display: block;
  max-height: 48px;
  margin: 0 auto 12px auto;
}
.productName{
  text-align: center;
  font-weight: 700;
  font-size: 1.2em;
}
</style>
