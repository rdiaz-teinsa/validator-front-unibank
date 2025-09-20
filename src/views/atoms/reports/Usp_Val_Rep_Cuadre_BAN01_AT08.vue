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
          <b-row class="mb-2">
            <b-col md="12" class="text-right">
              <b-button v-on:click="onBtExport()" class="btn" variant="primary">
                <feather-icon
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
              <ag-grid-vue style="width: 100%; height: 100%;"
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
                           :pagination="true"
                           :paginationPageSize=20
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

    <!--    Second Table-->

    <div v-if="rows2.length > 0" class="mt-3">
      <b-row>
        <b-col>
          <h4>Sucursales que no estan en la BAN01</h4>
          <ag-grid-vue style="width: 100%; height: 100%;"
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
                       :pagination="true"
                       :paginationPageSize=20
                       :rowData="rows2"
                       :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
                       :cacheQuickFilter="true">
          </ag-grid-vue>
        </b-col>
      </b-row>
    </div>
    <b-row v-else-if="apiMessage2">
      <b-col class="text-primary apiMessage">
        {{ apiMessage2 }}
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
import {gridDef, getColDefinitionsDyna} from "@/views/atoms/reports/ag-grid-def";
import {AgGridVue} from "ag-grid-vue";
import store from "@/store";
import {exportMultipleSheetsAsExcel} from "ag-grid-enterprise";

export default {
  name: "USC_AT21_ONLY_2.vue",
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
      cutOffDate: '',
      columns: [
        {
          headerName: 'Cuadre BAN01 vs Átomo Efectivo Mensual AT08',
          headerClass: 'headerCenter',
          children: [
            {
              headerName: "Código Banco",
              field: "COD_BANCO",
              headerClass: 'headerBlue',
              cellClass: 'stringType',
              cellClassRules: 'stringType',
            },
            {
              headerName: "Código Subsidiaria",
              field: "COD_SUBSIDIARIA",
              sortable: false,
              headerClass: 'headerBlue',
              cellClass: 'stringType',
            },
            {
              headerName: "Código Rubro SB22",
              field: "COD_RUBRO_SB22",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Número Ubicación",
              field: "NUM_UBICACION",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Tipo Operación",
              field: "TIPO_OPERACION",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Código Sucursal",
              field: "COD_SUCURSAL",
              sortable: false,
              headerClass: 'headerBlue',
              cellClass: 'stringType',
              cellClassRules: 'stringType',
            },
            {
              headerName: "Código Transacción SB16",
              field: "COD_TRANSACCION_SB16",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Origen",
              field: "ORIGEN",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Nombre Cliente",
              field: "NOM_CLIENTE",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "RUC Cliente",
              field: "RUC_CLIENTE",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Código País Cliente",
              field: "COD_PAIS_CLIENTE_SB03",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Nombre Ejecutor",
              field: "NOM_EJECUTOR",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "RUC Ejecutor",
              field: "RUC_EJECUTOR",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Código País Ejecutor",
              field: "COD_PAIS_EJECUTOR_SB03",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Responsable",
              field: "RESPONSABLE",
              sortable: false,
              headerClass: 'headerBlue',
            },
            {
              headerName: "Cargo",
              field: "CARGO",
              sortable: false,
              headerClass: 'headerBlue',
              cellClass: 'stringType',
              cellClassRules: 'stringType',
            },
            {
              headerName: "Monto",
              field: "MONTO",
              sortable: false,
              headerClass: 'headerBlue',
              cellClass: 'numberType',
              valueFormatter: params => this.currencyFormatFn(params.data.MONTO),
            },
          ]
        },
      ],
      columns2: [
        {
          headerName: "Código Sucursal",
          field: "COD_SUCURSAL",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
          maxWidth: 180
        },
      ],
      searchTerm: "",
      loading: false,
      rows: '',
      rows2: '',
      apiMessage: '',
      apiMessage2: '',
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
    this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`)
  },
  methods: {
    async generateReport() {
      try {
        this.loading = true;
        const res = await this.$http.post(
            environment.uri + "/reportes/validator/code/290/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
              tipo: 1,
              idReporte: 1
            })
        this.rows = res.data.record
        this.apiMessage = res.data.message
        const res2 = await this.$http.post(
            environment.uri + "/reportes/validator/code/290/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
              idReporte: 2
            })
        this.rows2 = res2.data.record
        console.log('h: ', getColDefinitionsDyna(this.rows2, this.colDefi))

        this.apiMessage2 = res.data.message


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
        params.api.setColumnDefs(getColDefinitionsDyna(this.rows2, this.colDefi))
      }
    },
    onBtExport() {
      let spreadsheets = [];
      spreadsheets.push(
          this.leftApi.getSheetDataForExcel({sheetName: 'Cuadre BAN01 vs AT08'}),
          this.rightApi.getSheetDataForExcel({sheetName: 'Sucursales no en BAN01'})
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

