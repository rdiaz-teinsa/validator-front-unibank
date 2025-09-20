<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <b-col md="12" sm="12">
        <b-row>
          <b-col md="4">
            <b-link :to="{path:'/atoms/dashboard'}">
            <img :src="logo[0].logo" alt="Base64 Image" class="dashboardLogo ">
            </b-link>
          </b-col>
          <b-col md="3">
            <div class="pt-1">
              <div class="float-left pr-2 font-medium-1" style="margin-top: 6px;">
                Licencia:
              </div>
              <div class="float-left">
                <b-form-select
                    ref="licencia"
                    v-model="licencia"
                    text-field="label"
                    value-field="value"
                    :options="bankData"
                    @change="onChange()"
                    @blur="onChange()"
                />
              </div>

            </div>
          </b-col>
          <b-col md="5">
            <div class="pt-1">
              <div class="float-left pr-2 font-medium-1" style="margin-top: 6px;">
                Fecha de Corte:
              </div>
              <div class="float-left">
                <b-input-group class="">
                  <b-form-input
                      id="dateCheck"
                      v-model="fechaCorte"
                      type="text"
                      @change="onChange()"
                      @blur="onChange()"
                      placeholder="Seleccionar Fecha de Corte"
                      autocomplete="off"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-form-datepicker
                        v-model="fechaCorte"
                        button-only
                        right
                        locale="en-US"
                        aria-controls="example-input"
                        @context="onContext"
                        style="height: 38px;"
                    ></b-form-datepicker>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
<!--      <notification-dropdown />-->
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BRow, BCol, BFormGroup, BFormSelect, BFormDatepicker, BInputGroup, BInputGroupAppend, BFormInput
} from 'bootstrap-vue'
import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from "@/store";

export default {
  components: {
    BLink,
    BRow, BCol, BFormGroup,
    BFormSelect,
    BNavbarNav,
    NotificationDropdown,
    UserDropdown,
    BFormDatepicker, BInputGroup, BInputGroupAppend, BFormInput
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      logo:'',
      selected: null,
      DatePickerFormat: 'yyyyMMdd',
      // fechaCorte: null,
      locale: 'es-US',
      options: [
        { value: null, text: 'Seleccione Licencia' },
        { value: '999', text: '999 - TEINSA BAN' },
        { value: '888', text: '888 - ACME BAN' },
        { value: '027', text: '027 - RAUL ' },
      ],
    }
  },
  computed: {
    fechaCorte: {
      get: function(){
        return this.$store.state.app.fechaCorte
      },
      set: function(value){
        this.$store.commit('app/UPDATE_FECHA_CORTE', value)
        location.reload()
      }
    },
    licencia: {
      get: function(){
        return this.$store.state.app.selectedBank
      },
      set: function(value){
        this.$store.commit('app/UPDATE_BANK', value)
      }
    },
    bankData: {
      get: function(){
        return this.$store.state.app.bankData
      },
      set: function(value){
        this.$store.commit('app/UPDATE_BANKDATA', value)
      }
    }
  },
  methods: {
    onChange() {
          console.log('change...')
          if(!this.licencia || !this.fechaCorte) {
              this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                      text: 'Debe colocar un licencia y una fecha de corte',
                      title: 'Error',
                      variant: 'danger',
                  },
              })

              if(!this.licencia) {
                  this.$refs.licencia.focus();
              }else {
                  this.$refs.fechaCorte.focus();
              }
          }
      },
    onContext(ctx) {
      // The date formatted in the locale, or the `label-no - date - selected` string
      this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      this.selected = ctx.selectedYMD
    },
  },
  mounted: function(){
    window.navbbar = this
    this.logo = store.getters["app/getBankData"].filter(function (item) {
      return item.value === store.getters["app/getSelectedBank"]
    });
  }
}
</script>

<style>
.dashboardLogo{
  max-width: 220px;
  margin-bottom: 16px;
}
</style>
