<template>
    <b-card-code title="">
        <b-row>
            <b-col>
                <h2>Listado de Periodos</h2>
            </b-col>
        </b-row>
        <hr class="mt-2 mb-2"/>
        <b-row>
            <b-col>
                <div class="custom-search d-flex justify-content-end">
                    <b-form-group>
                        <div class="d-flex align-items-center">
                            <label class="mr-1">Buscar</label>
                            <b-form-input
                                    v-model="searchTerm"
                                    placeholder="Buscar"
                                    type="text"
                                    class="d-inline-block"
                            />
                        </div>
                    </b-form-group>
                </div>
                <!-- table -->
                <vue-good-table

                        ref="table"
                        :columns="columns"
                        :rows="rows"
                        @on-selected-rows-change="selectionChanged"
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
              <router-link
                      tag="span"
                      :to="{
                        path: '/atoms/atom-periods-processes',
                        query: {
                          periodo:props.row.ID_PERIODO,
                          frecuencia:props.row.FRECUENCIA
                        },
                      }"
              >
              <b-button variant="light-dark">
                <feather-icon icon="EyeIcon" class=""/>
              </b-button>
              </router-link>
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
import {BFormDatepicker, VBPopover} from "bootstrap-vue";
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
    BAlert,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
} from "bootstrap-vue";

import {VueGoodTable} from 'vue-good-table';
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Ripple from "vue-ripple-directive";
import environment from "@/environment";

import {mapGetters} from "vuex";

export default {
    name: "AtomAvailable",
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
        vSelect,
        BFormDatepicker,
        BAlert,
    },
    computed: {
        statusVariant() {
            const statusColor = {
                /* eslint-disable key-spacing */
                0: "light-primary",
                Professional: "light-success",
                Rejected: "light-danger",
                Resigned: "light-warning",
                Applied: "light-info",
                /* eslint-enable key-spacing */
            };
            return (status) => statusColor[status];
        },
        ...mapGetters({
            fechaCorte: "app/getFechaCorte",
            licencia: "app/getSelectedBank",
        }),
        /**
         * Activar o desactivar el boton de registrar
         */
        permitirRegistrar: function () {
            return (
                this.licencia !== null &&
                (this.licencia.value !== null || this.licencia.value !== undefined) &&
                this.fechaCorte !== null &&
                this.fechaCorte.length > 8 &&
                (this.selected.value !== null || this.selected.value !== undefined)
            );
        },
        /**
         * El valor seleccionado para "Tipo de Corrida"
         */
        selected: {
            get: function () {
                return this.$store.state.app.atomo_tipo_corrida;
            },
            set: function (value) {
                this.$store.commit("app/UPDATE_ATOMO_TIPO_CORRIDA", value);
            },
        },
    },
    directives: {
        "b-popover": VBPopover,
        Ripple,
    },
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userData")),
            pageLength: 25,
            dir: false,
            // selected: {title: 'Tipo de Corrida', value: null},
            runType: [
                {
                    title: "SBP",
                    value: "SBP",
                    icon: "HomeIcon",
                },
                {
                    title: "Prueba",
                    value: "Prueba",
                    icon: "CoffeeIcon",
                },
            ],
            frequency: {},
            columns: [
                {
                    label: "Id Periodo",
                    field: "ID_PERIODO",
                },
                {
                    label: "Frecuencia",
                    field: "FRECUENCIA",
                },
                {
                    label: "Tipo de Corrida",
                    field: "TIPO_CORRIDA",
                },
                {
                    label: "Procesos Totales",
                    field: "PROCESOS_TOTALES",
                },
                {
                    label: "Procesos Abiertos",
                    field: "PROCESOS_ABIERTOS",
                },
                {
                    label: "Procesos Cerrados",
                    field: "PROCESOS_CERRADOS",
                },
                {
                    label: "Procesos Pendientes",
                    field: "PROCESOS_PENDIENTES",
                },
                {
                    label: "Fch. Inicio",
                    field: "FECHA_INICIO",
                },
                {
                    label: "Fch. Cierre",
                    field: "FECHA_CIERRE",
                },
                {
                    label: "",
                    field: "action",
                },
            ],
            rows: [],
            rowSelection: [],
            searchTerm: "",
            value: null,
            loading: false,
        };
    },
    created() {
        this.periodConsult();
    },
    methods: {
        async periodConsult() {
            if (this.$store.getters["app/getSelectedBank"] === null || this.$store.getters["app/getFechaCorte"] === null) {
                await this.$router.push({name: 'atom-dashboard'})
            } else {
                try {
                    const dateF = this.fechaCorte.replaceAll("-", "");
                    const res = await this.$http.get(
                        environment.uri +
                        '/validador/periodos/banco/' + this.$store.getters["app/getSelectedBank"]);
                    this.rows = res.data
                } catch (err) {
                    console.error(err);
                } finally {
                    this.loading = false;
                }
            }

        },
        selectionChanged(params) {
            this.rowSelection = params.selectedRows;
        },
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";
@import "@core/scss/vue/libs/vue-select.scss";

.infoRowClass {
  background: #f3f3f3;
  font-weight: normal;
  font-size: 14px;
  color: $primary;
}

.infoRowClass a {
  display: none;
}

.infoRowClass .vgt-pull-right {
  float: none !important;
  margin: 10px 0;
}

.status0:after {
  content: "Pendiente";
  background-color: #8fc4cb;
  color: #ffffff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status1:after {
  content: "Error de Carga";
  background-color: #dc3737;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status2:after {
  content: "Cargado";
  background-color: #97d297;
  color: #413a3a;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status3:after {
  content: "Validado";
  background-color: #03520a;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status4:after {
  content: "Certificado";
  background-color: #003064;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status5:after {
  content: "Aprobado";
  background-color: #003f00;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}
</style>
