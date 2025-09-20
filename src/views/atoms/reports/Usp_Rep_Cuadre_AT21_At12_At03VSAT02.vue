<template>
    <b-card-code :title="this.$route.query.report">
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
        <b-row>
            <b-col class="text-center p4">
                <b-spinner type="grow" variant="primary" label="Loading..." v-if="loading"/>
            </b-col>
        </b-row>
       <div v-if="rows.length > 0">
            <div class="mb-2">

            </div>
            <b-row>
                <b-col>
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
                    <ag-grid-vue style="width: 100%;"
                                 class="ag-theme-alpine"
                                 ref="agGrid"
                                 @grid-ready="onGridReady($event, 0)"
                                 @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                                 :columnDefs="columns"
                                 :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                                 :defaultColDef="this.gridOptions.defaultColDef"
                                 :excelStyles="this.gridOptions.excelStyles"
                                 :suppressRowClickSelection="true"
                                 :groupSelectsChildren="true"
                                 :pagination="false"
                                 :paginationPageSize="this.gridOptions.paginationPageSize"
                                 :rowData="rows"
                                 :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
:cacheQuickFilter="true">
                    </ag-grid-vue>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-row class="mt-3">
                        <b-col md="12">
                            <h5>Cuadre con el AT02</h5>
                        </b-col>
                    </b-row>
                    <ag-grid-vue style="width: 100%;"
                                 class="ag-theme-alpine"
                                 ref="agGrid"
                                 @grid-ready="onGridReady($event, 1)"
                                 @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                                 :columnDefs="columns2"
                                 :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                                 :defaultColDef="this.gridOptions.defaultColDef"
                                 :excelStyles="this.gridOptions.excelStyles"
                                 :suppressRowClickSelection="true"
                                 :groupSelectsChildren="true"
                                 :pagination="false"
                                 :paginationPageSize="this.gridOptions.paginationPageSize"
                                 :rowData="rows.filter((_, index) => index  === 0)"
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
import vSelect from 'vue-select'
import {BFormDatepicker} from 'bootstrap-vue'
import {mapGetters} from "vuex";
import environment from "@/environment";
import {AgGridVue} from "ag-grid-vue";
import {exportMultipleSheetsAsExcel} from "ag-grid-enterprise";
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
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
        BSpinner,
        vSelect,
        BFormDatepicker,
        AgGridVue
    },
    data() {
        return {
            extraRowContainer: false,
            loading: false,
            cutOffDate: '2023-04-30',
            columns: [
                {
                    headerName: '',
                    headerClass: 'headerWhite headerCenter',
                    children: [
                        {
                            headerName: "Descripción",
                            field: "DESCRIPCION",
                            headerClass: 'headerBlue',
                        },
                        {
                            headerName: "AT21",
                            field: "SALDO_AT21",
                            sortable: false,
                            headerClass: 'headerBlue',
                            cellClass: 'numberType',
                             valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT21),
                        },
                        {
                            headerName: "AT12",
                            field: "SALDO_AT12",
                            sortable: false,
                            headerClass: 'headerBlue',
                            cellClass: 'numberType',
                             valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT12),
                        },
                        {
                            headerName: "AT12 Facilidad 01",
                            field: "SALDO_AT12_FACILIDAD_01",
                            sortable: false,
                            headerClass: 'headerBlue',
                            cellClass: 'numberType',
                            width: '110px',
                             valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT12_FACILIDAD_01),
                        },
                        {
                            headerName: "AT12 Facilidad 02",
                            field: "SALDO_AT12_FACILIDAD_02",
                            sortable: false,
                            headerClass: 'headerBlue',
                            cellClass: 'numberType',
                            width: '110px',
                             valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT12_FACILIDAD_02),
                        },
                        {
                            headerName: "AT03",
                            field: "SALDO_AT03",
                            sortable: false,
                            headerClass: 'headerBlue',
                            cellClass: 'numberType',
                             valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT03),
                        },
                        {
                            headerName: "BAN06",
                            field: "SALDO_BA06",
                            sortable: false,
                            headerClass: 'headerBlue',
                            cellClass: 'numberType',
                             valueFormatter: params => this.currencyFormatFn(params.data.SALDO_BA06),
                        },
                    ]
                },
                {
                    headerName: 'Cuadres',
                    headerClass: 'headerCenter',
                    children: [
                        {
                            headerName: "AT21 vs AT12",
                            field: "AT21VSAT12",
                            sortable: false,
                            headerClass: 'headerBlue',
                             valueFormatter: params => this.currencyFormatFn(params.data.AT21VSAT12),
                            cellClass: 'numberType',
                            width: '120px'
                        },
                        {
                            headerName: "AT12 vs AT03",
                            field: "AT12vsAT03",
                            sortable: false,
                            headerClass: 'headerBlue',
                             valueFormatter: params => this.currencyFormatFn(params.data.AT12VSAT03),
                            cellClass: 'numberType',
                            width: '120px'
                        },
                        {
                            headerName: "AT12 vs BAN06",
                            field: "AT12VSBA06",
                            sortable: false,
                            headerClass: 'headerBlue',
                             valueFormatter: params => this.currencyFormatFn(params.data.AT12VSBA06),
                            cellClass: 'numberType',
                            width: '120px'
                        },
                    ]
                },
            ],
            columns2: [
                {
                    headerName: "Monto Pignorado AT02",
                    field: "SALDO_AT02",
                    sortable: false,
                    headerClass: 'headerBlue',
                     valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT02),
                    cellClass: 'numberType',
                    width: '120px'
                },
                {
                    headerName: "AT21",
                    field: "SALDO_AT21_AT02",
                    sortable: false,
                    headerClass: 'headerBlue',
                     valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT21_AT02),
                    cellClass: 'numberType',
                    width: '120px'
                },
                {
                    headerName: "AT12",
                    field: "SALDO_AT012_AT02",
                    sortable: false,
                    headerClass: 'headerBlue',
                     valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT012_AT02),
                    cellClass: 'numberType',
                    width: '120px'
                },
                {
                    headerName: "AT03",
                    field: "SALDO_AT003_AT02",
                    sortable: false,
                    headerClass: 'headerBlue',
                     valueFormatter: params => this.currencyFormatFn(params.data.SALDO_AT003_AT02),
                    cellClass: 'numberType',
                    width: '120px'
                },
                {
                    headerName: "AT02 vs AT21",
                    field: "AT02VSAT21",
                    sortable: false,
                    headerClass: 'headerBlue',
                     valueFormatter: params => this.currencyFormatFn(params.data.AT02VSAT21),
                    cellClass: 'numberType',
                    width: '120px'
                },
                {
                    headerName: "AT02 vs AT12",
                    field: "AT02VSAT12",
                    sortable: false,
                    headerClass: 'headerBlue',
                     valueFormatter: params => this.currencyFormatFn(params.data.AT02VSAT12),
                    cellClass: 'numberType',
                    width: '120px'
                },
            ],
            searchTerm: "",
            rows: '',
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
                this.extraRowContainer = false
                const res = await this.$http.post(
                    environment.uri + "/reportes/validator/code/772/",
                    {
                        codBanco: this.$store.getters["app/getSelectedBank"],
                        fechaCorte: this.$store.getters["app/getFechaCorte"],
                    })
                this.rows = res.data.record
              this.apiMessage = res.data.message
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
                document.getElementById("mainView").scrollIntoView({behavior: 'smooth'});
            }
        },
        onBtExport() {
            let spreadsheets = [];

            spreadsheets.push(
                this.first.getSheetDataForExcel({ sheetName: 'Cuadre AT21 | AT03 | AT02 | BAN06' }),
                this.second.getSheetDataForExcel({ sheetName: 'Cuadre con el AT02' })
            );

            exportMultipleSheetsAsExcel({
                data: spreadsheets,
                fileName: `${this.$route.name}-${this.getCurrentDateTime()}.xlsx`,
            });
                    },
        onGridReady(params, order) {
            if (order === 0) {
                this.first = params.api;
            }

            if (order === 1) {
                this.second = params.api;
            }
          this.gridApi.refreshHeader();
          this.gridApi.refreshCells();
        },
    },
}
</script>
<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
</style>



