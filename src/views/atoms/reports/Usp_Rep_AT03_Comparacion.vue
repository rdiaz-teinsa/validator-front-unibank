<template>
    <b-card-code :title="this.$route.query.report"  id="mainView">
        <b-row>
            <b-col md="4">
                <b-form-group>
                    <b-form-datepicker
                            id="example-datepicker"
                            class="mb-1"
                            disabled
                            :placeholder=this.$store.state.app.fechaCorte
                            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                            locale="es"
                    />
                </b-form-group>
            </b-col>
            <b-col md="4">
                <b-button variant="primary" @click="generateReport">Generar Reporte</b-button>
            </b-col>
        </b-row>
        <hr class="mb-1">
        <b-row>
            <b-col class="text-center p4">
                <b-spinner type="grow" variant="primary" label="Loading..." v-if="loading"/>
            </b-col>
        </b-row>
       <div v-if="rows.length > 0">
            <b-row>
                <b-col class="ag-gridContainer">
                    <b-row>
                        <b-col md="4">
                            <b-form-input type="text" id="filter-text-box" placeholder="Buscar..." class="mb-2" v-on:input="onFilterTextBoxChanged()"></b-form-input>
                        </b-col>
                        <b-col md="8" class="text-right">
                            <b-button v-on:click="onBtExport()" class="btn" variant="primary"><feather-icon
                  icon="DownloadIcon"
                  class="mr-50"
              />
                <span class="align-middle">Exportar a Excel</span></b-button>
                        </b-col>
                    </b-row>
                  <b-row v-if="rows.length > 50">
                    <b-col class="pb-1">
                      <div>
                        Registros por Páginas:
                        <select @change="onPageSizeChanged()" id="page-size" class="pageSelect">
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </b-col>
                  </b-row>
                    <ag-grid-vue style="width: 100%; height: 100%;"
                                 class="ag-theme-alpine"
                                 ref="agGrid"
                                 @grid-ready="onGridReady"
                                 @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                                 :columnDefs="columns"
                                 :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                                 :defaultColDef="this.gridOptions.defaultColDef"
                                 :excelStyles="this.gridOptions.excelStyles"
                                 :suppressRowClickSelection="true"
                                 :groupSelectsChildren="true"
                                 :pagination="true"
                                 :paginationPageSize="this.gridOptions.paginationPageSize"
                                 :rowData="rows"
                                 :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
:cacheQuickFilter="true">
                    </ag-grid-vue>
                </b-col>
            </b-row>
        </div>
      <b-row v-else-if="apiMessage">
        <b-col class="text-primary apiMessage">
          {{ apiMessage }}
        </b-col>
      </b-row>
    </b-card-code>
</template>

<script>
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import {BRow, BCol, BFormGroup, BButton, BFormSelect, BPagination, BFormInput, BSpinner} from "bootstrap-vue";
import {VueGoodTable} from "vue-good-table";
import vSelect from 'vue-select'
import {BFormDatepicker} from 'bootstrap-vue'
import {mapGetters} from "vuex";
import environment from "@/environment";
import { AgGridVue } from "ag-grid-vue";

import {gridDef} from './ag-grid-def';
import store from "@/store";


export default {
    name: "InconsistenciasTemplate.vue",
    components: {
        BCardCode,
        BFormGroup,
        BFormSelect,
        BPagination,
        BRow,
        BCol,
        BButton,
        BFormInput,
        vSelect,
        BFormDatepicker,
        BSpinner,
        VueGoodTable,
        AgGridVue
    },
    data() {
        return {
            extraRowContainer: false,
            cutOffDate: '2023-04-30',
            columns: [
                {
                    headerName: 'Comparación del Átomo de Crédito',
                    headerClass: 'headerWhite',
                    children: [
                        {
                            headerName: "Nº de Préstamo",
                            field: "NUMERO_PRESTAMO",
                            headerClass: 'headerBlue',
                        },
                        {
                            headerName: "Nombre del Cliente",
                            field: "CLIENTE",
                            headerClass: 'headerBlue',
                        },
                        {
                            headerName: "Campo",
                            field: "CAMPO",
                            headerClass: 'headerBlue',
                        },
                    ],
                },
                {
                    headerName: 'Valores AI',
                    headerClass: 'headerCenter',
                    children: [
                        {
                            headerName: "",
                            field: "VALOR_ACTUAL",
                            sortable: false,
                            headerClass: 'headerBlue',
                            width: '180px',
                            cellClass: 'stringType',
                            valueFormatter: params => params.data.VALOR_ACTUAL,
                            headerValueGetter: this.valorActualHeader
                        },
                        {

                            headerName: "",
                            field: "VALOR_ANTERIOR",
                            headerClass: 'headerBlue',
                            sortable: false,
                            width: '180px',
                            cellClass: 'stringType',
                            valueFormatter: params => params.data.VALOR_ANTERIOR,
                            headerValueGetter: this.valorAnteriorHeader
                        },
                    ]

                },
            ],
            loading: false,
            rows: '',
            defaultExcelExportParams: null,
            apiMessage: '',
            gridOptions: gridDef(),
        }
    },
    computed: {
        ...mapGetters({
            fechaCorte: "app/getFechaCorte",
            licencia: "app/getSelectedBank",
        }),
    },
  beforeMount() {
    let stylesData = store.getters["app/getBankData"].filter(function (item) {
      return item.value === store.getters["app/getSelectedBank"]
    });
this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`)  },
    methods: {
      async generateReport() {
            try {
                this.loading = true;
                const res = await this.$http.post(
                    environment.uri + "/reportes/validator/code/111/",
                    {
                        codBanco: this.$store.getters["app/getSelectedBank"],
                        fechaCorte: this.$store.getters["app/getFechaCorte"],
                    })
                this.rows = res.data.record
              this.apiMessage = res.data.message
              this.gridApi.refreshHeader()
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
                document.getElementById("mainView").scrollIntoView({behavior: 'smooth'})
            }
        },
      onBtExport() {
        let params = {
          fileName: `${this.$route.name}-${this.getCurrentDateTime()}.xlsx`,
          exportMode: 'xlsx',
        };
        console.log(this.gridApi.exportDataAsExcel(params))
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridApi.refreshHeader();
        this.gridApi.refreshCells();
      },
      valorActualHeader(){
        return this.rows[0].FECHA_ACTUAL.substring(0, 10)
      },
      valorAnteriorHeader(){
        return this.rows[0].FECHA_ANTERIOR.substring(0, 10)
      },
      onFilterTextBoxChanged() {
        this.gridApi.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
      },
      onPageSizeChanged() {
        let valueSize  = document.getElementById('page-size').value;
        this.gridApi.paginationSetPageSize(Number(valueSize));
      }
    },
}
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-good-table.scss";

@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

</style>


