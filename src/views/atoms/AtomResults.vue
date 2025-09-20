<template>
    <b-card-code title="">
        <b-row>
            <b-col md="12">
                <h3>Átomo: {{ this.$route.query.atom }}</h3>
                <h4 class="text-primary text-capitalize">Validación Tipo: {{ this.$route.query.tipo }}</h4>
                <span class="font-small-3"></span>
            </b-col>

        </b-row>
      <b-row class="mt-1">
        <b-col>
          <h4>Total de Registros: {{ resumen.total_registros }}</h4>
        </b-col>
      </b-row>
        <b-row class="mt-4">
            <b-col xl="3" sm="3">
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar size="64" variant="light-info">
                            <feather-icon size="38" icon="CoffeeIcon" class=""/>
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto" v-if="resumen">
                        <h3 class="font-weight-bolder mb-0">{{ resumen.sin_validar }}</h3>
                        <b-card-text class="font-small-4 mb-0"> Sin Validar</b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
            <b-col xl="3" sm="3">
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar size="64" variant="light-info">
                            <feather-icon
                                    size="38"
                                    icon="CheckCircleIcon"
                                    class="text-success"
                            />
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">{{ resumen.sin_errores }}</h3>
                        <b-card-text class="font-small-4 mb-0"> Sin Errores</b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
            <b-col xl="3" sm="3" class="cursor-pointer" @click="changeErrorType('funcional')">
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar size="64" variant="light-info">
                            <feather-icon
                                    size="38"
                                    icon="AlertCircleIcon"
                                    class="text-danger"
                            />
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">
                            {{ resumen.errores_funcionales }}
                        </h3>
                        <b-card-text class="font-small-4 mb-0">
                            Errores Funcionales
                        </b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
            <b-col xl="3" sm="3" class="cursor-pointer" @click="changeErrorType('estructural')">
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar size="64" variant="light-info">
                            <feather-icon
                                    size="38"
                                    icon="GitPullRequestIcon"
                                    class="text-danger"
                            />
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">
                            {{ resumen.errores_estructural }}
                        </h3>
                        <b-card-text class="font-small-4 mb-0">Errores Estructurales</b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
        </b-row>
        <hr class="mt-2 mb-2"/>
        <b-row class="mb-2">
            <b-col>
                <b-button
                        variant="outline-primary"
                        title="Registro Anterior"
                        @click="backNavigate"
                >
                    <feather-icon icon="ArrowLeftIcon"/>
                    <span>Regresar</span>
                </b-button>
            </b-col>
        </b-row>

        <hr class="mt-2 mb-2"/>
        <b-row>
            <b-col>
                <!-- search input -->
                <div class="custom-search">
                    <b-row>
                        <b-col md="4" xs="8">
                            <b-form-group>
                                <div class="d-flex align-items-center">
                                    <div class="pt-50 pr-2 text-nowrap"><h5>Validación Tipo:</h5></div>
                                    <b-form-select
                                            v-on:change="changeErrorType(errorTypeActive)"
                                            v-model="errorTypeActive"
                                            :options="errorTypesSelect"
                                    />
                                </div>
                            </b-form-group>
                        </b-col>
                        <b-col md="8" xs="4" class="text-right">
                            <b-button
                                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                                variant="outline-primary"
                                :disabled="loading"
                                @click="download(rows)"
                            >
                                Exportar a Excel
                            </b-button>
                        </b-col>
                    </b-row>

                </div>
                <div v-if="parametersCheck" class="text-center">
                    <b-alert
                            variant="warning"
                            show
                    >
                        <div class="alert-body">
                            <span><strong>Revise los parámetros en la parte superior para continuar.</strong></span>
                        </div>
                    </b-alert>
                </div>
                <div v-if="loading" class="text-center">
                    <b-alert
                            variant="primary"
                            show
                    >
                        <div class="alert-body">
                            <span><strong>Cargando Datos...</strong></span>
                        </div>
                    </b-alert>
                </div>

                <!-- table -->
                <vue-good-table
                        v-if="!loading"
                        :columns="columns"
                        :rows="rows"
                        :row-style-class="rowStyleClassFn"
                        :rtl="direction"
                        :search-options="{
            enabled: true,
            externalQuery: searchTerm,
          }"
                        :pagination-options="{
            enabled: true,
            perPage: pageLength,
          }"
                >
                    <template slot="table-row" slot-scope="props">
                        <!-- Column: Action -->
                        <span v-if="props.column.field === 'action'">
              <span v-if=" props.row.cantidad > 0">

                <router-link
                        :to="{
                        name: 'atom-drill-down',
                        query: {
                        codBanco: currentBank,
                        fechaSib: fechaCorte,
                        idAtomo : props.row.id_atomo,
                        idError : props.row.id_validacion,
                        tipo: $route.query.tipo,
                        usuario: activeUser.username,
                        },
                      }"
                >
                  <b-button variant="light"
                  ><feather-icon icon="EyeIcon"></feather-icon
                  ></b-button>
                </router-link>
              </span>
            </span>
                        <span
                                v-else-if="props.column.field === 'errorQuantity'"
                                class="text-center text-danger"
                        >
              <b-badge variant="danger"
              ><h5 class="text-light">
                  {{ props.formattedRow[props.column.field] }}
                </h5></b-badge
              >
            </span>
                        <span
                                v-else-if="props.column.field === 'DESCRIPCON'"
                                class="text-center"
                        >
              <span class="testing">
                  {{ props.formattedRow[props.column.field] }}
              </span
              >
            </span>
                        <!-- Column: Common -->
                        <span v-else>
              {{ props.formattedRow[props.column.field] }}
            </span>
                    </template>

                    <!-- pagination -->
                    <template slot="pagination-bottom" slot-scope="props">
                        <div class="d-flex justify-content-between flex-wrap">
                            <div class="d-flex align-items-center mb-0 mt-1">
                                <span class="text-nowrap"> Mostrando 1 a </span>
                                <b-form-select
                                        v-model="pageLength"
                                        :options="['3', '5', '10']"
                                        class="mx-1"
                                        @input="
                    (value) => props.perPageChanged({ currentPerPage: value })
                  "
                                />
                                <span class="text-nowrap">
                  de {{ props.total }} registros
                </span>
                            </div>
                            <div>
                                <b-pagination
                                        :value="1"
                                        :total-rows="props.total"
                                        :per-page="pageLength"
                                        first-number
                                        last-number
                                        align="right"
                                        prev-class="prev-item"
                                        next-class="next-item"
                                        class="mt-1 mb-0"
                                        @input="(value) => props.pageChanged({ currentPage: value })"
                                >
                                    <template #prev-text>
                                        <feather-icon icon="ChevronLeftIcon" size="18"/>
                                    </template>
                                    <template #next-text>
                                        <feather-icon icon="ChevronRightIcon" size="18"/>
                                    </template>
                                </b-pagination>
                            </div>
                        </div>
                    </template>
                </vue-good-table>
            </b-col>
        </b-row>
    </b-card-code>
</template>

<script>
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import {
    BCol,
    BRow,
    BButton,
    BProgress,
    BMedia,
    BCardText,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BAlert
} from "bootstrap-vue";
import {VueGoodTable} from "vue-good-table";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import store from "@/store";
import environment from "@/environment";
import {mapGetters} from "vuex";
import {downloadExcel} from "@core/utils/utils";

export default {
    name: "AtomResults",
    components: {
        BCol,
        BRow,
        BButton,
        BProgress,
        BCardCode,
        BMedia,
        BAvatar,
        BMediaAside,
        BMediaBody,
        VueGoodTable,
        BBadge,
        BPagination,
        BFormGroup,
        BFormInput,
        BFormSelect,
        BDropdown,
        BDropdownItem,
        BCardText,
        BAlert,
    },
    data() {
        return {
            pageLength: 50,
            dir: false,
            rows: [],
            searchTerm: "",
            loading: true,
            parametersCheck: false,
            activeUser: 'Hola',
            /**
             * Muestra el resumen, los iconos grandes arriba de la tabla
             */
            resumen: {
                sin_validar: 0,
                sin_errores: 0,
                errores_funcionales: 0,
                errores_estructural: 0,
                total_registros: 0
            },
            errorTypeActive: this.$route.query.tipo,
            errorTypesSelect: [
                {value: 'funcional', text: 'Funcional'},
                {value: 'estructural', text: 'Estructural'}
            ]
        };
    },
    created() {
        if (this.$store.getters["app/getSelectedBank"] === null || this.$store.getters["app/getFechaCorte"] === null) {
            this.parametersCheck = true
        } else {
            this.$http.get("/atoms/general").then((res) => {
                this.rows = res.data;
            });
        }
    },
    computed: {
        ...mapGetters({
            // fechaCorte: "app/getFechaCorte",
            licencia: "app/getSelectedBank",
        }),
        direction() {
            if (store.state.appConfig.isRTL) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.dir = true;
                return this.dir;
            }
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.dir = false;
            return this.dir;
        },
        tipo_validacion: function () {
            if (!this.$route.query.tipo) {
                return "estructural";
            }
            return this.$route.query.tipo;
        },
        url_validacion: function () {
            if (this.tipo_validacion == "estructural") {
                return environment.uri + "/validador/estructural/resumen";
            }
            return environment.uri + "/validador/funcional/resumen";
        },

        fechaCorte: function () {
            return this.$store.getters["app/getFechaCorte"];
        },
        currentBank: function () {
            return this.$store.state.app.selectedBank
        },
        columns: function () {
            if (this.tipo_validacion == "estructural") {
                return [
                    {
                        label: "Id Átomo",
                        field: "id_atomo",
                    },
                    {
                        label: "Tabla de SBP",
                        field: "t_sb",
                    },
                    {
                        label: "Descripción",
                        field: "descripcion",
                    },
                    {
                        label: "Campo",
                        field: "campo",
                    },
                    {
                        label: "Permite NA",
                        field: "permite_na",
                    },
                    {
                        label: "Cantidad",
                        field: "cantidad",
                        tdClass: "text-center",
                    },
                    {
                        label: "",
                        field: "action",
                        sortable: false,
                    },
                ];
            }
            return [
                {
                    label: "Id Átomo",
                    field: "id_atomo",
                    sortable: false,
                },
                {
                    label: "Átomo",
                    field: "atomo",
                    sortable: false,
                },
                {
                    label: "Regla",
                    field: "id_validacion",
                },
                {
                    label: "Registros",
                    field: "cantidad",
                },
                {
                    label: "Tipo",
                    field: "tipo",
                },
                {
                    label: "Tipo Advertencia",
                    field: "tipo_advertencia",
                    sortable: false,
                },

                {
                    label: "Descripción",
                    field: "descripcon",
                    sortable: false,
                },
                {
                    label: "Fecha SIB",
                    field: "fecha_sib",
                    width: "120px",
                    formatFn: this.dateFormatFn
                },
                {
                    label: "",
                    field: "action",
                    sortable: false,
                },
            ];
        },
    },
    watch: {
        $route: {
            handler: "validar",
            immediate: true,
        },
        licencia: {
            handler: "validar",
        },
        fechaCorte: {
            handler: "validar",
        },
    },
    methods: {
        /**
         * Obtener validaciones segun el tipo
         */

        obtener_validaciones: async function () {
            try {
                this.loading = true
                const userDx = JSON.parse(localStorage.getItem('userData'))
              this.activeUser = JSON.parse(localStorage.getItem('userData'))
                return await this.$http
                    .post(this.url_validacion, {
                        codBanco: this.$store.getters["app/getSelectedBank"],
                        fechaSib: this.fechaCorte,
                        idAtomo: this.$route.query.idAtom,
                        usuario: userDx.userData.username
                    })
                    .then((response) => {
                        return response.data;
                    });
            } catch (err) {
                console.error(err);
                this.$toast({
                    component: ToastificationContent,
                    position: "top-right",
                    props: {
                        title: `Se presento un error en la carga de datos.`,
                        icon: "BellIcon",
                        variant: "danger",
                    },
                });
            } finally {
                this.loading = false
            }

        },
        /**
         * Obtener resumen desde el api
         */
        obtener_resumen: async function () {
            /// donde dice sin validar, sin errores y son iconos arriba de la tabla
            // @todo
            //const rescon =
          const userDx = JSON.parse(localStorage.getItem('userData'))
            await this.$http
                .post(environment.uri + "/validador/indicadores", {
                    codBanco: this.$store.getters["app/getSelectedBank"],
                    fechaSib: this.fechaCorte,
                    atomo: this.$route.query.atom,
                    usuario: userDx.userData.username
                })
                .then((response) => {
                    let rescon = response.data;
                    if (response.data.length > 0) {
                        rescon = response.data[0];
                    }
                    this.resumen.sin_validar = rescon.Sin_Validar;
                    this.resumen.sin_errores = rescon.Sin_Errores;
                    this.resumen.errores_funcionales = rescon.Funcionales;
                    this.resumen.errores_estructural = rescon.Estructurales;
                    this.resumen.total_registros = rescon.Total_Registros;
                });
        },
        validar: async function () {
            if (
                this.fechaCorte == null ||
                (this.licencia && this.licencia.value && this.licencia.value.toString().length == 0)
            ) {
                this.$toast({
                    component: ToastificationContent,
                    position: "top-right",
                    props: {
                        title: "Revisar licencia o fecha de corte",
                        icon: "BellIcon",
                        variant: "warning",
                    },
                });
                return;
            }
            try {
                await this.obtener_resumen();
                this.rows = await this.obtener_validaciones();
            } catch (err) {
                console.error(err);
                this.$toast({
                    component: ToastificationContent,
                    position: "top-right",
                    props: {
                        title: "Algo salió mal, vuelve a intentarlo",
                        icon: "BellIcon",
                        variant: "danger",
                    },
                });
            }
            this.loading = false;
        },
        changeErrorType(e) {
            this.$router.push(
                {
                    path: '/atoms/atom-results/', query: {
                        idAtom: this.$route.query.idAtom,
                        atom: this.$route.query.atom,
                        tipo: e,
                        periodo: this.$route.query.periodo,
                    }
                })
        },
        rowStyleClassFn(row) {
            return row.COLOR === "#FF0000" ? "errorRow" : "";
        },
        download(rows) {
            if(this.$route.query.tipo == 'estructural'){
                const items = rows.map(item => ({
                  id_atomo: (item.id_atomo || ''),
                    t_sb: (item.t_sb || ''),
                  descripcion: (item.descripcion || ''),
                    campo: (item.campo || ''),
                  permite_na: (item.permite_na || ''),
                  cantidad: (item.cantidad || 0),
                }))
                downloadExcel(items, [
                    'id Átomo',
                    'Tabla de SBP',
                    'Descripción',
                    'Campo',
                    'Permite NA',
                    'Cantidad',
                ], `validacion_tipo_${this.$route.query.tipo}_Atomo_${this.$route.query.atom}-${this.getCurrentDateTime()}.csv` )
            }
            else{
                const items = rows.map(item => ({
                    id_atomo: (item.id || ''),
                    atomo: (item.atomo || ''),
                  id_validacion: (item.id_validacion || ''),
                  cantidad: (item.cantidad || ''),
                    tipo: (item.tipo || ''),
                  tipo_advertencia: (item.tipo_advertencia || 0),
                  descripcon: (item.descripcon || 0),
                  fecha_sib: (item.fecha_sib || 0),
                }))
                downloadExcel(items, [
                    'id Átomo',
                    'Átomo',
                    'Regla',
                    'Registros',
                    'Tipo',
                    'Tipo Advertencia',
                    'Descripción',
                    'Fecha SIB',
                ], `validacion_tipo_${this.$route.query.tipo}_Atomo_${this.$route.query.atom}-${this.getCurrentDateTime()}.csv`)
            }

        },


    },

};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";

.errorRow span {
  color: red !important;
}
</style>
