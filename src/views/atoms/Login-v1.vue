<template>
  <div class="auth-wrapper auth-v1 px-5">
    <div class="auth-inner py-4">

      <!-- Login v1 -->
      <b-card class="mb-0 mt-5 ">
        <div class="brand-logo">
          <img src="logo-h.svg" style="width: 70%; max-width: 260px;"></img>
        </div>
        <b-card-text class="mb-2 text-center">
          Seleccione licencia y fecha corte, luego inicie sesión con Microsoft.
        </b-card-text>

        <b-alert
            variant="primary"
            show
        >
          <div
              v-if="errorMessage"
              class="alert-body font-small-2"
          >
            <p>
              <small class="mr-50">
                <span class="font-weight-bold">{{ errorMessage }}</span>
              </small>
            </p>
          </div>
        </b-alert>
        <!-- Selection fields for bank and date -->
        <b-row class="mt-1">
          <b-col md="6">
            <b-form-group label="Licencia">
              <b-form-select
                  v-model="licencia"
                  text-field="label"
                  value-field="value"
                  :options="bankDataBancos"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Fecha Corte">
              <b-form-datepicker
                  id="dateCheck"
                  :locale="locale"
                  v-model="fechaCorte"
                  :format="DatePickerFormat"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  placeholder="Fecha Corte"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <div class=" auth-v1 mt-2">
          <div>
                <button
                    type="button"
                    class="ms-signin-btn w-100"
                    @click="loginWithMicrosoft"
                    :disabled="loading || !licencia || !fechaCorte"
                    aria-label="Sign in with Microsoft"
                >
                <span class="ms-signin-btn__logo" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <rect width="9" height="9" x="0" y="0" fill="#F35325"/>
                    <rect width="9" height="9" x="11" y="0" fill="#81BC06"/>
                    <rect width="9" height="9" x="0" y="11" fill="#05A6F0"/>
                    <rect width="9" height="9" x="11" y="11" fill="#FFBA08"/>
                  </svg>
                </span>
                  <span class="ms-signin-btn__text" v-if="!loading">Sign in with Microsoft</span>
                  <span class="ms-signin-btn__text" v-else>Connecting…</span>
                </button>

          </div>
        </div>
        <b-card-footer>
          <div class="mt-5 small text-right ">
            by <a href="https://teinsa-pa.com" target="_blank" class="text-decoration-none text-secondary" title="Ir a TEINSA">Tecnología Inteligente S.A.</a>
          </div>
        </b-card-footer>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BRow, BCol, BLink, BFormGroup, BCardText, BCardTitle, BAlert, BCard, BFormSelect, BFormDatepicker } from 'bootstrap-vue'
import environment from "@/environment"
import { msalInstance, loginRequest } from '@/auth/msalConfig'

export default {
  components: {
    BFormDatepicker,
    BFormSelect,
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BCardText,
    BCardTitle,
    BAlert,
    BCard,
  },
  mixins: [],
  data() {
    return {
      loading: false,
      errorMessage: '',
      
      selected: null,
      DatePickerFormat: 'yyyyMMdd',
      locale: 'es-US',
      licences: '',
      options: [
        { value: null, text: 'Licencia' },
        { value: '999', text: '999 - TEINSA BAN' },
        { value: '888', text: '888 - ACME BAN' },
        { value: '027', text: '027 - RAUL ' },
      ],
      bankDataBancos: []
    }
  },
  created() {
    this.loadLicences()
  },
  computed: {
    fechaCorte: {
      get: function(){
        return this.$store.state.app.fechaCorte
      },
      set: function(value){
        this.$store.commit('app/UPDATE_FECHA_CORTE', value)
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
    },
    frecuency: {
      get: function(){
        return this.$store.state.app.frecuency
      },
      set: function(value){
        this.$store.commit('app/UPDATE_FRECUENCY', value)
      }
    }
  },
  methods: {
    async loginWithMicrosoft() {
      try {
        this.loading = true;
        this.errorMessage = '';

        // Validar que licencia y fechaCorte estén presentes
        if (!this.licencia || !this.fechaCorte) {
          this.loading = false;
          this.errorMessage = 'Debe seleccionar una licencia y una fecha de corte.';
          return;
        }

        // Persistir selección para restaurar tras el redirect
        try {
          localStorage.setItem('app.selectedBank', JSON.stringify(this.licencia));
          localStorage.setItem('app.fechaCorte', JSON.stringify(this.fechaCorte));
        } catch (e) {
          // noop si localStorage falla
        }

        // Esto redirigirá al usuario a la página de Microsoft
        const redirectUri = `${window.location.origin}/oauth`
        // Force redirectUri explicitly to ensure return target
        await msalInstance.loginRedirect({ ...loginRequest, redirectUri });

        // El código después de esto no se ejecutará,
        // ya que la página se redirigirá.

      } catch (err) {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Error al intentar iniciar sesión con Microsoft.';
      }
    },
    async loadLicences() {
      try {
        this.loading = true;
        const res = await this.$http.get(
            environment.uri + "/validador/catalogos")
        this.bankData = res.data.bancos
        this.bankDataBancos = res.data.bancos
        this.frecuency = res.data.frecuencias

      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';

.ms-signin-btn {
  appearance: none;
  border: 1px solid #8A8886;
  border-radius: 4px;
  background-color: #ffffff;
  color: #000000;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease;
  
  &:hover:not(:disabled) {
    background-color: #ffffff;
    border-color: #6e6d6c;
  }
  &:active:not(:disabled) {
    background-color: #ededed;
    border-color: #6e6d6c;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #e4e4e4; /* gray background when disabled */
    border-color: #e1e1e1;     /* lighter gray border */
    color: #c5c5c5;            /* muted text */
    box-shadow: none;
  }
}
.ms-signin-btn__logo {
  display: inline-flex;
  margin-right: 10px;
}
.ms-signin-btn__text {
  font-weight: 500;
}
</style>
