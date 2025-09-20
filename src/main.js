import Vue from 'vue'
import {ModalPlugin, ToastPlugin} from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import {format} from 'date-fns'

import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'


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

LicenseManager.setLicenseKey("[TRIAL]_this_AG_Grid_Enterprise_key_( AG-043119 )_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_purchasing_a_production_key_please_contact_( info@ag-grid.com )___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_( 31 August 2023 )____[v2]_MTY5MzQzNjQwMDAwMA==458ec7edd8751844a9f17a7441427632")

// Axios Mock Adapter
import '@/@fake-db/db'
import environment from "@/environment";

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app')

Vue.mixin({
    beforeRouteEnter(to, from, next) {
        const localStorageVariable = localStorage.getItem('userData');

        if (!localStorageVariable && to.path !== '/login') {
            next('/login');
        } else {
            next();
        }
    },
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
            const allColumnIds = [];
            params.columnApi.getAllColumns().forEach((column) => {
                allColumnIds.push(column.getId());
            });
            params.columnApi.autoSizeColumns(allColumnIds);
        },

    },
});



