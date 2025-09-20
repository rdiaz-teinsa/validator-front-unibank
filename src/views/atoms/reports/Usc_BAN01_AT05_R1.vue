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
        <hr class="mb-1" id="mainView">
        <b-row>
            <b-col class="text-center p4">
                <b-spinner type="grow" variant="primary" label="Loading..." v-if="loading"/>
            </b-col>
        </b-row>
           <div v-if="rows.length > 0">
                <b-row>
                    <b-col class="ag-gridContainer">
                        <b-row class="mt-2 mb-2">
                            <b-col md="12" class="text-right">
                                <b-button v-on:click="onBtExport()" class="btn" variant="primary"><feather-icon
                  icon="DownloadIcon"
                  class="mr-50"
              />
                <span class="align-middle">Exportar a Excel</span></b-button>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col md="6">
                                <ag-grid-vue style="width: 100%; height: 170px;"
                                             class="ag-theme-alpine"
                                             ref="agGrid"
                                             @grid-ready="onGridReady($event, 0)"
                                             @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                                             :columnDefs="columnsSuc"
                                             :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                                             :defaultColDef="this.gridOptions.defaultColDef"
                                 :excelStyles="this.gridOptions.excelStyles"
                                             :suppressRowClickSelection="true"
                                             :groupSelectsChildren="true"
                                             :paginationPageSize="this.gridOptions.paginationPageSize"
                                             :rowData="rowsSuc"
                                             :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
:cacheQuickFilter="true">
                                </ag-grid-vue>
                            </b-col>
                            <b-col md="6">
                                <ag-grid-vue style="width: 100%; height: 170px;"
                                             class="ag-theme-alpine"
                                             ref="agGrid"
                                             @grid-ready="onGridReady($event, 1)"
                                             @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                                             :columnDefs="columnsAtm"
                                             :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                                             :defaultColDef="this.gridOptions.defaultColDef"
                                 :excelStyles="this.gridOptions.excelStyles"
                                             :suppressRowClickSelection="true"
                                             :groupSelectsChildren="true"
                                             :paginationPageSize="this.gridOptions.paginationPageSize"
                                             :rowData="rowsAtm"
                                             :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
:cacheQuickFilter="true">
                                </ag-grid-vue>
                            </b-col>
                        </b-row>


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
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
import {AgGridVue} from "ag-grid-vue";
import {exportMultipleSheetsAsExcel} from "ag-grid-enterprise";
import store from "@/store";

export default {
    name: "InconsistenciasTemplate.vue",
    components: {
        BSpinner,
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
        AgGridVue
    },
    data() {
        return {
            extraRowContainer: false,
            cutOffDate: '2020-06-30',
            pageLength: 50,
            searchTerm: "",
            loading: false,
            rowsSuc: '',
            rowsAtm: '',
            rows: '',
            apiMessage: '',
            gridOptions: gridDef(),
            columnsSuc: [
                        {
                            headerName: "Número de Sucursales",
                            field: "DESCRIPCION",
                          headerClass: 'headerBlue',
                        },
                        {
                            headerName: "",
                            field: "NUM_SUC",
                          headerClass: 'headerBlue',
                        },
            ],
            columnsAtm: [
                        {
                            headerName: "Cantidad de ATM",
                            field: "DESCRIPCION",
                          headerClass: 'headerBlue',
                        },
                        {
                            headerName: "",
                            field: "NUM_SUC",
                          headerClass: 'headerBlue',
                        },
            ]
        }
    },
    computed: {
        ...mapGetters({
            fechaCorte: "app/getFechaCorte",
            licencia: "app/getSelectedBank",
        }),
        filteredSuc() {
            return this.rows.filter(row => row.TIPO === 'SUC');
        },
        filteredAtm() {
            return this.rows.filter(row => row.TIPO === 'ATM');
        }
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
                    environment.uri + "/reportes/validator/code/285/",
                    {
                        codBanco: this.$store.getters["app/getSelectedBank"],
                        fechaCorte: this.$store.getters["app/getFechaCorte"],
                    })
                this.rows = res.data.record
                this.rowsAtm = this.rows.filter(row => row.TIPO === 'ATM');
                this.rowsSuc = this.rows.filter(row => row.TIPO === 'SUC');
              this.apiMessage = res.data.message
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
                document.getElementById("mainView").scrollIntoView({behavior: 'smooth'});
            }
        },
        onGridReady(params, side) {
            if (side === 0) {
                this.leftApi = params.api;
            }

            if (side === 1) {
                this.rightApi = params.api;
            }
          this.gridApi.refreshHeader();
          this.gridApi.refreshCells();
        },
        onBtExport() {
            let spreadsheets = [];

            spreadsheets.push(
                this.leftApi.getSheetDataForExcel({ sheetName: 'Número de Sucursales' }),
                this.rightApi.getSheetDataForExcel({ sheetName: 'Cantidad de ATM' })
            );

            exportMultipleSheetsAsExcel({
                data: spreadsheets,
                fileName: `${this.$route.name}-${this.getCurrentDateTime()}.xlsx`,
            });
        },
    },
}
</script>
<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
</style>



