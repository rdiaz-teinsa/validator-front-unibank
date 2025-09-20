<template>
    <b-card-code title="">
        <b-row>
            <b-col md="12">
                <h3 class="">
                    Procesos para el Periodo: {{ $route.query.periodo }}
                </h3>
            </b-col>
        </b-row>
        <hr class="mt-2 mb-2"/>
        <b-row>
            <b-col md="12">
                <b-alert variant="primary" show>
                    <div class="alert-body">
                        <feather-icon
                                icon="InfoIcon"
                                size="16"
                                class="mr-2"
                                v-b-popover.hover.html.right="{
                customClass: 'classPop',
                title: 'Cargar Átomos',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                html: true,
              }"
                        />
                        <span class="font-weight-light"
                        >Seleccione Átomos a Cargar y presione el botón</span
                        >
                    </div>
                </b-alert>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button
                        variant="outline-primary"
                        class="mb-2"
                        :disabled="rowSelection.length <= 0"
                        @click="importData()"
                >
                    <feather-icon icon="DownloadIcon" class="mr-2"></feather-icon>
                    <span v-if="!loading" class="align-middle"
                    >Cargar {{ rowSelection.length }} Átomo<span
                            v-if="rowSelection.length > 1"
                    >s</span
                    ></span
                    >
                    <span v-if="loading">Cargando...</span>
                </b-button>
                <feather-icon
                        icon="InfoIcon"
                        size="16"
                        class="ml-2 mb-1"
                        v-b-popover.hover.html.right="{
            customClass: 'classPop',
            title: 'Cargar Átomos',
            content:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            html: true,
          }"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
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
                        :select-options="{
            enabled: true,
            selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
            disableSelectInfo: true, // disable the select info panel on top
            selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
          }"
                >
                    <template slot="table-row" slot-scope="props">
                        <!-- Column: Status -->
                        <span v-if="props.column.field === 'STATUS'">
              <b-badge> </b-badge>
              <span :class="'status' + props.row.STATUS"></span>
            </span>

                        <!-- Column: Action -->
                        <span v-else-if="props.column.field === 'action'">
              <span>
                <b-dropdown
                        variant="link"
                        toggle-class="text-decoration-none"
                        no-caret
                >
                  <template v-slot:button-content>
                    <feather-icon
                            icon="MoreVerticalIcon"
                            size="16"
                            class="text-body align-middle mr-25"
                    />
                  </template>
                  <b-dropdown-item>
                    <router-link
                            tag="span"
                            :to="{
                        name: 'atom-results',
                        query: {
                          idAtom: props.row.ID_ATOMO,
                          atom: props.row.ATOMO,
                          tipo: 'estructural',
                          periodo: props.row.PERIODO
                        },
                      }"
                    >
                      <feather-icon icon="CheckIcon" class="mr-50"/>
                      <span>Validación Estructural</span>
                    </router-link>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <router-link
                            tag="span"
                            :to="{
                        name: 'atom-results',
                        query: {
                          idAtom: props.row.ID_ATOMO,
                          atom: props.row.ATOMO,
                          tipo: 'funcional',
                          periodo: props.row.PERIODO
                        },
                      }"
                    >
                      <feather-icon icon="CheckIcon" class="mr-50"/>
                      <span>Validación Funcional</span>
                    </router-link>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <feather-icon icon="XCircleIcon" class="mr-50"/>
                    <span>Cancelar</span>
                  </b-dropdown-item>
                </b-dropdown>
              </span>
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
import {VueGoodTable} from "vue-good-table";
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
            selectedDate: "",
            locale: "es-US",
            frequency: {},
            columns: [
                {
                    label: "Id",
                    field: "ID_ATOMO",
                },
                {
                    label: "Átomo",
                    field: "ATOMO",
                },
                {
                    label: "Descripción",
                    field: "DESCRIPCION",
                },
                {
                    label: "Periodo",
                    field: "PERIODO",
                },
                {
                    label: "Cant. Registros",
                    field: "REG_TOTALES",
                },
                {
                    label: "Err. Estructurales",
                    field: "ERR_ESTRUCTURALES",
                },
                {
                    label: "Err. Funcionales",
                    field: "ERR_FUNCIONALES",
                },
                {
                    label: "Reg. Correctos",
                    field: "REG_CORRECTOS",
                },
                {
                    label: "Status",
                    field: "STATUS",
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
            creado: false,
        };
    },
    created() {
        this.load();
    },
    methods: {
        async load() {
            if (this.$store.getters["app/getFechaCorte"] != null) {
                try {
                    this.loading = true;
                    const res = await this.$http.get("/atoms/atomsFrequency");
                    const dateF = this.fechaCorte.replaceAll("-", "");

                    // const {data} = await this.$http.get('/atoms/atomsCatalog');

                    const {data} = await this.$http.get(
                        environment.uri +
                        '/validador/procesos/' + this.$route.query.periodo
                    );

                    this.rows = data

                    /*this.frequency = res.data.find(
                    (item) => item.frequency == this.$route.query.group
                  );
                  this.rows = data.filter(
                    (frequency) => frequency.FRECUENCIA == this.$route.query.group
                  );*/

                } catch (err) {
                    console.error(err);
                } finally {
                    this.loading = false;
                }
            } else {
                await this.$router.push({name: 'atom-dashboard'})
            }
        },
        async importData() {
            if (this.$store.getters["app/getSelectedBank"] != null) {
                try {
                    const list = this.$refs["table"].selectedRows;
                    const dateF = this.fechaCorte.replaceAll("-", "");
                    this.loading = true;
                    const res2 = await this.$http.post(
                        environment.uri + "/validador/periodo/importar",
                        {
                            codBanco: this.$store.getters["app/getSelectedBank"],
                            fechaCorte: dateF,
                            frecuencia: this.$route.query.frecuencia,
                            usuario: this.user.userData.username,
                            os: "LIX",
                            idPeriodo:
                                this.$store.getters["app/getSelectedBank"] +
                                "-" +
                                this.$route.query.frecuencia +
                                "-" +
                                dateF,
                            ejecutables:
                                list.reduce((prev, curr) => {
                                    let val = prev;
                                    if (val) {
                                        val = val + ", " + curr.ID_ATOMO;
                                    } else {
                                        val = curr.ID_ATOMO;
                                    }
                                    return val;
                                }, null).toString(),
                        }
                    );

                    this.rows = res2.data;

                    this.$toast({
                        component: ToastificationContent,
                        position: "top-right",
                        props: {
                            title: `Ejecutado`,
                            icon: "BellIcon",
                            variant: "success",
                        },
                    });
                } catch (err) {
                    console.error(err);
                    this.$toast({
                        component: ToastificationContent,
                        position: "top-right",
                        props: {
                            title: `Algo salió mal, vuelve a intentarlo`,
                            icon: "BellIcon",
                            variant: "danger",
                        },
                    });
                } finally {
                    this.loading = false;
                }
            } else {
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
