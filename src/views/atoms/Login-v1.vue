<template>
    <div class="auth-wrapper auth-v1 px-2">
        <div class="auth-inner py-2">

            <!-- Login v1 -->
            <b-card class="mb-0">
                <b-link class="brand-logo">
                    <img src="logo-h.svg" style="width: 70%;"></img>
                </b-link>
                <b-card-text class="mb-2">
                    Ingrese sus credenciales para iniciar.

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

                <!-- form -->
                <validation-observer
                        ref="loginForm"
                        #default="{invalid}"
                >
                    <b-form
                            class="auth-login-form mt-2"
                            @submit.prevent="login(userEmail, password)"
                    >
                        <!-- email -->
                        <b-form-group
                                label="Usuario"
                                label-for="login-email"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Email"
                                    vid="email"
                            >
                                <b-form-input
                                        id="login-email"
                                        v-model="userEmail"
                                        :state="errors.length > 0 ? false:null"
                                        name="login-email"
                                        placeholder=""
                                />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- forgot password -->
                        <b-form-group>
                            <div class="d-flex justify-content-between">
                                <label for="login-password">Contraseña</label>
                                <b-link :to="{name:'auth-forgot-password'}">
                                    <small>Olvido su contraseña?</small>
                                </b-link>
                            </div>
                            <validation-provider
                                    #default="{ errors }"
                                    name="Password"
                                    vid="password"
                                    rules="required"
                            >
                                <b-input-group
                                        class="input-group-merge"
                                        :class="errors.length > 0 ? 'is-invalid':null"
                                >
                                    <b-form-input
                                            id="login-password"
                                            v-model="password"
                                            :state="errors.length > 0 ? false:null"
                                            class="form-control-merge"
                                            :type="passwordFieldType"
                                            name="login-password"
                                            placeholder=""
                                    />
                                    <b-input-group-append is-text>
                                        <feather-icon
                                                class="cursor-pointer"
                                                :icon="passwordToggleIcon"
                                                @click="togglePasswordVisibility"
                                        />
                                    </b-input-group-append>
                                </b-input-group>
                                <b-row class="mt-2">
                                    <b-col md="6">
                                        <b-form-select
                                            v-model="licencia"
                                            text-field="label"
                                            value-field="value"
                                            :options="bankDataBancos"
                                        />
                                    </b-col>
                                    <b-col md="6">
                                        <b-form-datepicker
                                            id="dateCheck"
                                            :locale="locale"
                                            v-model="fechaCorte"
                                            :format="DatePickerFormat"
                                            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                                            placeholder="Fecha Corte"
                                        />
                                    </b-col>
                                </b-row>
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- checkbox -->
                        <b-form-group>
                            <b-form-checkbox
                                    id="remember-me"
                                    v-model="status"
                                    name="checkbox-1"
                            >
                                Recordarme
                            </b-form-checkbox>
                        </b-form-group>

                        <!-- submit buttons -->
                        <b-button
                                type="submit"
                                variant="secondary"
                                block
                                :disabled="!licencia || !fechaCorte"
                        >
                            <span v-if="!loading">Ingresar</span>
                            <span v-if="loading">Cargando...</span>
                        </b-button>
                    </b-form>
                </validation-observer>
            </b-card>
            <!-- /Login v1 -->
        </div>
    </div>
</template>

<script>
/* eslint-disable global-require */
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    BCard,
    VBTooltip, BFormSelect, BFormDatepicker,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import {required, email} from '@validations'
import {togglePasswordVisibility} from '@core/mixins/ui/forms'
import store from '@/store/index'
import {getHomeRouteForLoggedInUser} from '@/auth/utils'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import environment from "@/environment";

export default {
    directives: {
        'b-tooltip': VBTooltip,
    },
    components: {
        BFormDatepicker,
        BFormSelect,
        BRow,
        BCol,
        BLink,
        BFormGroup,
        BFormInput,
        BInputGroupAppend,
        BInputGroup,
        BFormCheckbox,
        BCardText,
        BCardTitle,
        BImg,
        BForm,
        BButton,
        BAlert,
        BCard,
        ValidationProvider,
        ValidationObserver,
    },
    mixins: [togglePasswordVisibility],
    data() {
        return {
            loading: false,
            errorMessage: '',
            status: '',
            sideImg: require('@/assets/images/pages/login-v2.svg'),

            // validation rules
            required,
            email,
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
        passwordToggleIcon() {
            return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
        },
        imgUrl() {
            if (store.state.appConfig.layout.skin === 'dark') {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
                return this.sideImg
            }
            return this.sideImg
        },
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
        async login(username, password) {
            try {
                this.errorMessage = ''
                this.loading = true
                await this.$refs.loginForm.validate()

                const {data} = await useJwt.login({username, password})
                const {accessToken} = data
                // Guard against missing/invalid token
                if (!accessToken || accessToken === 'null' || accessToken === 'undefined') {
                    // Ensure no stale token remains
                    useJwt.setToken('')
                    localStorage.removeItem('userData')
                    this.loading = false
                    this.errorMessage = data?.message || 'Credenciales inválidas o token no emitido.'
                    return
                }

                const userData = {...data, ability: data.userData.ability}
                // const userData = { ...data, ability: abilities.reader }
                delete userData.accessToken

                useJwt.setToken(accessToken)
                localStorage.setItem('userData', JSON.stringify(userData))

                // await this.$store.dispatch('catalog/fetchCatalogs')

                this.$ability.update(userData.ability)
                this.$router.replace(getHomeRouteForLoggedInUser(data.userData.role))
                    .then(() => {
                        this.$toast({
                            component: ToastificationContent,
                            position: 'top-right',
                            props: {
                                title: `Bienvenido`,
                                // title: `Bienvenido ${userData.fullName || userData.username}`,
                                icon: 'CoffeeIcon',
                                variant: 'Info',
                                // text: `Has ingresado exitosamente como ${userData.role}.`


                                text: `Has ingresado exitosamente.`,
                            },
                        })
                    })

                this.loading = false
            } catch (err) {
                console.error(err)
                this.loading = false
                this.errorMessage = 'Valida los datos ingresados!!'
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
</style>
