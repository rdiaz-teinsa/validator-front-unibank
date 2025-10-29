<template>
    <b-card-code :title="this.$route.query.report">
        <b-row>
          {{error1}}
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
                    <b-row>
                        <b-col>
                            <ag-grid-vue style="width: 100%; height: 170px;"
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
                                         :paginationPageSize="this.gridOptions.paginationPageSize"
                                         :rowData="rows"
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
        AgGridVue,
    },
    data() {
        return {
            extraRowContainer: false,
            cutOffDate: '2020-06-30',
            rowsSuc: '',
            rowsAtm: '',
            columns: [
                {
                    headerName: "BAN10",
                    field: "PROVISION_01",
                    headerClass: 'headerBlue',
                    cellClass: 'numberType',
                    valueFormatter: params => this.currencyFormatFn(params.data.PROVISION_01),

                },
                {
                    headerName: "AT03",
                    field: "PROVISION_02",
                    headerClass: 'headerBlue',
                    cellClass: 'numberType',
                    valueFormatter: params => this.currencyFormatFn(params.data.PROVISION_02),

                },
                {
                    headerName: "Diferencia",
                    field: "PROVISION_03",
                    headerClass: 'headerBlue',
                    cellClass: 'numberType',
                    valueFormatter: params => this.currencyFormatFn(params.data.PROVISION_03),
                },
            ],
            searchTerm: "",
            rows: '',
            loading: false,
            dataItems: '',
            apiMessage: '',
          error1:'',
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
                    environment.uri + "/reportes/validator/code/315/",
                    {
                        codBanco: this.$store.getters["app/getSelectedBank"],
                        fechaCorte: this.$store.getters["app/getFechaCorte"],
                    })
                this.rows = res.data.record
                this.apiMessage = res.data.message
            } catch (err) {
                this.error1 = err
                console.error(err);
            } finally {
                this.loading = false;
                document.getElementById("mainView").scrollIntoView({behavior: 'smooth'});
            }
        },
      onBtExport() {
        let params = {
          fileName: `${this.$route.name}-${this.getCurrentDateTime()}.xlsx`,
          exportMode: 'xlsx',
        };
        // console.log('not reday', this.gridApi)
        console.log(this.gridApi.exportDataAsExcel(params))
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.gridApi.refreshHeader();
        this.gridApi.refreshCells();
      },
    },
}
</script>
<style lang="scss">
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-alpine.css";
</style>
