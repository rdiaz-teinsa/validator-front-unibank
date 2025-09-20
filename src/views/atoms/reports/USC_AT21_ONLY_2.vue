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
          <h4>Utilidad Anual por Región</h4>
          <ag-grid-vue style="width: 100%; height: 100%;"
                       class="ag-theme-alpine"
                       ref="agGrid"
                       @grid-ready="onGridReady($event, 1)"
                       @first-data-rendered="onFirstDataRendered"
domLayout='autoHeight'
                       :columnDefs=[]
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
          headerName: "Cod. Región SB03",
          field: "COD_REGION_SB03",
          headerClass: 'headerBlue',
          cellClass: 'stringType',
          maxWidth: 180
        },
        {
          headerName: "Utilidad Mes Corriente",
          field: "UTILIDAD_MES_CORRIENTE",
          sortable: false,
          headerClass: 'headerBlue',
          valueFormatter: params => this.currencyFormatFn(params.data.UTILIDAD_MES_CORRIENTE),
          cellClass: 'numberType',
          width: '180px'
        },
        {
          headerName: "Utilidad de Meses Anteriores",
          field: "UTILIDAD_MESES_ANTERIORES",
          sortable: false,
          headerClass: 'headerBlue',
          valueFormatter: params => this.currencyFormatFn(params.data.UTILIDAD_MESES_ANTERIORES),
          cellClass: 'numberType',
          width: '180px'
        },
        {
          headerName: "Utilidad Anual",
          field: "UTILIDAD_ANUAL",
          sortable: false,
          headerClass: 'headerBlue',
          valueFormatter: params => this.currencyFormatFn(params.data.UTILIDAD_ANUAL),
          cellClass: 'numberType',
          width: '180px'
        },
      ],
      // columns2: [
      //   {
      //     headerName: "Cod. Región SB03",
      //     field: "cod_region_sb03",
      //     cellClass: 'stringType',
      //     headerClass: 'headerBlue',
      //     maxWidth: 180
      //   },
      //   {
      //     headerName: "Tipo de Cuadre",
      //     field: "tipo_cuadre",
      //     sortable: false,
      //     headerClass: 'headerBlue',
      //     width: 180
      //   },
      //   {
      //     headerName: "20220731",
      //     field: "20220731",
      //     sortable: false,
      //     headerClass: 'headerBlue',
      //     valueFormatter: params => this.currencyFormatFn(params.data['20220731']),
      //     cellClass: 'numberType',
      //   },
      //   {
      //     headerName: "20220831",
      //     field: "20220831",
      //     sortable: false,
      //     headerClass: 'headerBlue',
      //     valueFormatter: params => this.currencyFormatFn(params.data['20220831']),
      //     cellClass: 'numberType',
      //     width: 180
      //   },
      //   {
      //     headerName: "20220930",
      //     field: "20220930",
      //     sortable: false,
      //     headerClass: 'headerBlue',
      //     valueFormatter: params => this.currencyFormatFn(params.data['20220930']),
      //     cellClass: 'numberType',
      //     width: 180
      //   },
      // ],
      columns2: '',
      searchTerm: "",
      loading: false,
      rows: '',
      rows2: '',
      apiMessage: '',
      apiMessage2: '',
      gridOptions: gridDef(),
      colDefi: [
        {
          headerName: "Cod. Región SB03",
          field: "COD_REGION_SB03",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
          minWidth: 120
        },
        {
          headerName: "Tipo de Cuadre",
          field: "TIPO_CUADRE",
          cellClass: 'stringType',
          headerClass: 'headerBlue',
          minWidth: 200
        }
      ],
      tData: [
        {
          "TIPO_CUADRE": "UTILIDAD DEL MES",
          "COD_REGION_SB03": "000",
          "20230131": 0,
          "20230228": 0,
          "20230331": 0,
          "20230430": 0,
          "20230531": 0,
          "20230630": 0,
          "20230731": 0,
          "20230831": 5432854.83,
          "20230930": 4961293.2,
          "20231031": 0,
          "20231130": 0,
          "20231231": 0,

        },
        {
          "TIPO_CUADRE": "UTILIDAD DEL MES",
          "COD_REGION_SB03": "008",
          "20230131": 0,
          "20230228": 0,
          "20230331": 0,
          "20230430": 0,
          "20230531": 0,
          "20230630": 0,
          "20230731": 0,
          "20230831": 14033565.37,
          "20230930": 13703984.96,
          "20231031": 0,
          "20231130": 0,
          "20231231": 0,
        },
        {
          "TIPO_CUADRE": "UTILIDAD DEL MES",
          "COD_REGION_SB03": "840",
          "20230131": 0,
          "20230228": 0,
          "20230331": 0,
          "20230430": 0,
          "20230531": 0,
          "20230630": 0,
          "20230731": 0,
          "20230831": 1845215.37,
          "20230930": 1748277.72,
          "20231031": 0,
          "20231130": 0,
          "20231231": 0,
        }
      ]
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
            environment.uri + "/reportes/validator/code/771/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
              tipo: 1
            })
        this.rows = res.data.record
        this.apiMessage = res.data.message
        const res2 = await this.$http.post(
            environment.uri + "/reportes/validator/code/800/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
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
        const rows2Mod = this.rows2
        params.api.setColumnDefs(getColDefinitionsDyna(rows2Mod[0], this.colDefi))
      }
    },
    onBtExport() {
      let spreadsheets = [];
      spreadsheets.push(
          this.leftApi.getSheetDataForExcel({sheetName: 'reporte'}),
          this.rightApi.getSheetDataForExcel({sheetName: 'Utilidad Anual Por Región'})
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

