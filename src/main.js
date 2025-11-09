/* eslint-disable */

// --- IMPORTS ---
import Vue from 'vue'
import {ModalPlugin, ToastPlugin} from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import {format} from 'date-fns'

import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'
import { msalInstance } from '@/auth/msalConfig' // MSAL import

// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// AG Grid Licence
import {LicenseManager} from 'ag-grid-enterprise'

// Axios Mock Adapter (dev only)
if (process.env.NODE_ENV === 'development') {
    // Loads axios-mock-adapter routes for local development
    require('@/@fake-db/db')
}
import environment from "@/environment";
import SafeHtml from '@/directives/safe-html'

// --- VUE CONFIG & PLUGINS ---
// (Must run before new Vue())

LicenseManager.setLicenseKey("[TRIAL]_this_AG_Grid_Enterprise_key_( AG-043119 )_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_purchasing_a_production_key_please_contact_( info@ag-grid.com )___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_( 31 August 2023 )____[v2]_MTY5MzQzNjQwMDAwMA==458ec7edd8751844a9f17a7441427632")

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

// Global directives
Vue.directive('safe-html', SafeHtml)

// Global Mixin
Vue.mixin({
    // NOTE: beforeRouteEnter does not work in global mixins.
    // This logic is (and should be) handled in your router/index.js (beforeEach)
    // I am keeping your other methods.
    methods: {
        backNavigate: function () {
            this.$router.back()
        },
        currencyFormatFn: function (value) {
            const options = {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            };
            if (isNaN(value) || value == null) {
                return parseFloat(0).toFixed(2);
            } else {
                let formatedValue = Number(value).toLocaleString('en', options);
                return formatedValue;
            }
        },
        dateFormatFn: function (dateValue) {
            let dateFormatedValue = dateValue.substring(0, 10)
            return dateFormatedValue
        },
        getCurrentDateTime() {
            return format(new Date(), 'yyyyMMddd_kms')
        },

        // Cell Style Error Case
        cellErrorDisplay: function (value){
            if (value > 0){
                return 'errorCell'
            }
            else {
                return
            }
        },
        onFirstDataRendered(params) {
            const cols = params.columnApi.getColumns ? params.columnApi.getColumns() : []
            const allColumnIds = cols.map(col => (typeof col.getColId === 'function' ? col.getColId() : col.getId()))
            if (allColumnIds.length) {
                params.columnApi.autoSizeColumns(allColumnIds)
            }
        },
    },
});

// --- MSAL INITIALIZATION & APP MOUNT ---
// (Must run LAST)
// This is the *ONLY* new Vue() mount
msalInstance.initialize().then(() => {
    try { console.log('[MSAL] initialized') } catch (e) {}
    // Handle the redirect promise on *every* page load
    msalInstance.handleRedirectPromise().then(async (response) => {
        try { console.log('[MSAL] handleRedirectPromise response:', response) } catch (e) {}
        // If a response is returned, MSAL just processed a login
        if (response && response.account) {
            msalInstance.setActiveAccount(response.account);
            try { console.log('[MSAL] active account set:', response.account) } catch (e) {}
        } else {
            const acct = msalInstance.getActiveAccount();
            try { console.log('[MSAL] no response; active account:', acct) } catch (e) {}
        }

        // NOW we mount the app, after all setup is done and MSAL is ready.
        new Vue({
            router,
            store,
            i18n,
            render: h => h(App),
        }).$mount('#app') // This is the single, correct mount

    }).catch((err) => {
        console.error("[MSAL] redirect processing error:", err);
        // Mount the app even if there's an error
        new Vue({
            router,
            store,
            i18n,
            render: h => h(App),
        }).$mount('#app');
    });

}).catch((err) => {
    console.error("[MSAL] initialization error:", err);
    // Also mount the app if initialization fails
    new Vue({
        router,
        store,
        i18n,
        render: h => h(App),
    }).$mount('#app');
});
