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
      <b-row class="mb-2" v-if="rows.length > 0 && rows2.length > 0 && rows3.length > 0 && rows4.length > 0">
        <b-col md="12" class="text-right">
          <b-button v-on:click="onBtExport()" class="btn" variant="primary">
            <feather-icon
                icon="DownloadIcon"
                class="mr-50"
            />
            <span class="align-middle">Exportar a Excel</span></b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="ag-gridContainer">
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
              <h4>Tipo Garantía AT12 vs AT03</h4>
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
          <h4>Monto Garantía AT03 vs AT12</h4>
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



    <!--    Third Table-->

    <div v-if="rows3.length > 0" class="mt-3">
      <b-row>
        <b-col>
          <h4>Tipo de Garantía por Préstamo</h4>
          <ag-grid-vue style="width: 100%; height: 100%;"
                       class="ag-theme-alpine"
                       ref="agGrid"
                       @grid-ready="onGridReady($event, 2)"
                       @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                       :columnDefs="columns3"
                       :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                       :defaultColDef="this.gridOptions.defaultColDef"
                       :excelStyles="this.gridOptions.excelStyles"
                       :suppressRowClickSelection="true"
                       :groupSelectsChildren="true"
                       :pagination="true"
                       :paginationPageSize=20
                       :rowData="rows3"
                       :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
                       :cacheQuickFilter="true">
          </ag-grid-vue>
        </b-col>
      </b-row>
    </div>
    <b-row v-else-if="apiMessage3">
      <b-col class="text-primary apiMessage">
        {{ apiMessage3 }}
      </b-col>
    </b-row>



    <!--    Forth Table-->

    <div v-if="rows4.length > 0" class="mt-3">
      <b-row>
        <b-col>
          <h4>Valor Garantía vs Valor Ponderado</h4>
          <ag-grid-vue style="width: 100%; height: 100%;"
                       class="ag-theme-alpine"
                       ref="agGrid"
                       @grid-ready="onGridReady($event, 3)"
                       @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                       :columnDefs="columns4"
                       :autoGroupColumnDef="this.gridOptions.autoGroupColumnDef"
                       :defaultColDef="this.gridOptions.defaultColDef"
                       :excelStyles="this.gridOptions.excelStyles"
                       :suppressRowClickSelection="true"
                       :groupSelectsChildren="true"
                       :pagination="true"
                       :paginationPageSize=20
                       :rowData="rows4"
                       :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
                       :cacheQuickFilter="true">
          </ag-grid-vue>
        </b-col>
      </b-row>
    </div>
    <b-row v-else-if="apiMessage4">
      <b-col class="text-primary apiMessage">
        {{ apiMessage4 }}
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
          headerName: "Descripción Grupo",
          field: "DESC_TIPO_GARANTIA_SB59",
          headerClass: 'headerBlue',
          width: 160,
        },
        {
          headerName: "Tipo Garantía",
          field: "TIPO_GARANTIA_SB59",
          sortable: false,
          headerClass: 'headerBlue',
          cellClass: 'stringType',
        },
        {
          headerName: "Descripción Tipo Garantía",
          field: "DESC_GRUPO_SB59",
          sortable: false,
          headerClass: 'headerBlue',
        },
        {
          headerName: "Monto AT12",
          field: "MONTO_AT12",
          sortable: false,
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MONTO_AT12),
        },
        {
          headerName: "Monto AT03",
          field: "MONTO_AT03",
          sortable: false,
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MONTO_AT03),
        },
        {
          headerName: "Diferencia",
          field: "DIF_MONTO",
          sortable: false,
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.DIF_MONTO),
        },
      ],
      columns2: [
        {
          headerName: "Prestamo AT03",
          field: "PRESTAMO_AT03",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Nombre Cliente",
          field: "NOMBRE_CLIENTE",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Garantía AT03",
          field: "GARANTIA_AT03",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Monto Átomo Crédito",
          field: "MONTO_ATOMO_CREDITO",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MONTO_ATOMO_CREDITO),
        },
        {
          headerName: "Monto Átomo Garantía",
          field: "MONTO_ATOMO_GARANTIAS",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MONTO_ATOMO_GARANTIAS),
        },
        {
          headerName: "Diferencía",
          field: "DIFERENCIA",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.DIFERENCIA),
        },
      ],
      columns3: [
        {
          headerName: "Número Prestamo",
          field: "NUMERO_PRESTAMO",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Tipo Garantía 1",
          field: "TIPO_GARANTIA_1",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Monto Garantía 1",
          field: "MTO_GARANTIA_1",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MTO_GARANTIA_1),
        },
      ],
      columns4: [
        {
          headerName: "Identificación Garantía",
          field: "IDENTIFICACION_GARANTIA",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Nombre Organismo",
          field: "NOMBRE_ORGANISMO",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Número Prestamo",
          field: "NUMEROPRESTAMO",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Número Prestamos Sin Guión",
          field: "NUMERO_PRESTAMO_SIN_GUION",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
        },
        {
          headerName: "Valor Garantía",
          field: "VALOR_GARANTIA",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.VALOR_GARANTIA),
        },
        {
          headerName: "Valor Ponderado",
          field: "VALOR_PONDERADO",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.VALOR_PONDERADO),
        },
      ],
      searchTerm: "",
      loading: false,
      rows: '',
      rows2: '',
      rows3:'',
      rows4:'',
      apiMessage: '',
      apiMessage2: '',
      apiMessage3: '',
      apiMessage4: '',
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
            environment.uri + "/reportes/validator/code/260/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
            })
        this.rows = res.data.record
        this.apiMessage = res.data.message

        const res2 = await this.$http.post(
            environment.uri + "/reportes/validator/code/261/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
            })
        this.rows2 = res2.data.record
        this.apiMessage2 = res2.data.message

        const res3 = await this.$http.post(
            environment.uri + "/reportes/validator/code/262/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
            })
        this.rows3 = res3.data.record
        this.apiMessage3 = res3.data.message

        const res4 = await this.$http.post(
            environment.uri + "/reportes/validator/code/263/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
            })
        this.rows4 = res4.data.record
        this.apiMessage4 = res4.data.message


      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
        document.getElementById("mainView").scrollIntoView({behavior: 'smooth'});
      }
    },

    onGridReady(params, side) {
      params.columnApi.autoSizeAllColumns();
      if (side === 0) {
        this.leftApi = params.api;
      }
      if (side === 1) {
        this.rightApi = params.api;
      }
      if (side === 2) {
        this.upApi = params.api;
      }
      if (side === 3) {
        this.downApi = params.api;
      }
    },
    onBtExport() {
      let spreadsheets = [];
      spreadsheets.push(
          this.leftApi.getSheetDataForExcel({sheetName: 'Tipo Garantias at03 vs at12'}),
          this.rightApi.getSheetDataForExcel({sheetName: 'Mto Garantias at03 vs at12'}),
          this.upApi.getSheetDataForExcel({sheetName: 'Prestamos en at12'}),
          this.downApi.getSheetDataForExcel({sheetName: 'Prestamos en at03'})
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
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-alpine.css";
</style>

