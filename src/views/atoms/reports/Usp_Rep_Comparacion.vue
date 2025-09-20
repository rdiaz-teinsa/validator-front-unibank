<template>
  <b-card-code :title="this.$route.query.report">
    <b-row>
      <b-col md="5">
        <b-form-group>
          <v-select
              v-model="selectedAtom"
              :options="atoms"
              label="DESCRIPCION"
              placeholder="Seleccione Átomo"
          />
        </b-form-group>
      </b-col>
      <b-col md="4" class="pr-1">
        <b-form-group>
          <b-form-datepicker
              id="example-datepicker"
              disabled
              class="mb-1"
              :placeholder=this.$store.state.app.fechaCorte
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              locale="es"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="5">
        <b-form-group>
          <v-select
              v-model="selectedAtomField"
              label="CAMPO"
              :options="filtered"
              placeholder="Campo a Comparar"
          />
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group>
          <v-select
              v-model="selectedSumAtom"
              label="CAMPO_SUMA"
              :options="filteredSumFinal"
              placeholder="Campo para la Sumatoria"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col md="4">
        <b-button
            :disabled="!this.$store.state.app.fechaCorte || !selectedAtom || !selectedAtomField || !selectedSumAtom"
            variant="primary" @click="generateReport">Generar Reporte
        </b-button>
      </b-col>
    </b-row>
    <hr class="mb-2">
    <b-row>
      <b-col class="text-center p4">
        <b-spinner type="grow" variant="primary" label="Loading..." v-if="loading"/>
      </b-col>
    </b-row>

    <div v-if="rows.length > 0">
      <div class="mb-2">

      </div>
      <b-row>
        <b-col class="ag-gridContainer">
          <b-row>
            <b-col md="4">
              <b-form-input type="text" id="filter-text-box" placeholder="Buscar..." class="mb-2"
                            v-on:input="onFilterTextBoxChanged()"></b-form-input>
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
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
import {AgGridVue} from "ag-grid-vue";
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
      columns: [
        {
          headerName: '',
          headerClass: 'headerWhite headerCenter',
          children: [
            {
              headerName: '',
              headerClass: 'headerWhite headerCenter',
              children: [
                {
                  headerName: "Desc. Campo",
                  field: "CAMPO",
                  headerClass: 'headerBlue'
                },
              ]
            },
          ]
        },
        {
          headerName: '',
          headerValueGetter: this.campoSumatoriaheader,
          headerClass: 'headerCenter',
          headerStyle: {color: 'red'},
          children: [
            {
              headerName: '--',
              headerValueGetter: this.fechaActualHeader,
              headerClass: 'headerCenter',
              children: [
                {
                  headerName: "Monto",
                  field: "VALOR_ACTUAL",
                  headerClass: 'headerBlue',
                  sortable: false,
                  width: '120px',
                  cellClass: 'numberType',
                  valueFormatter: params => this.currencyFormatFn(params.data.VALOR_ACTUAL),

                },
                {
                  headerName: "Cantidad",
                  field: "CONTEO_ACTUAL",
                  sortable: false,
                  headerClass: 'headerBlue',
                  maxWidth: 120

                },
              ]
            },
            {
              headerName: '--',
              headerValueGetter: this.fechaAnteriorHeader,
              headerClass: 'headerCenter',
              children: [
                {
                  headerName: "Monto",
                  field: "VALOR_ANTERIOR",
                  sortable: false,
                  headerClass: 'headerBlue',
                  width: '120px',
                  cellClass: 'numberType',
                  valueFormatter: params => this.currencyFormatFn(params.data.VALOR_ANTERIOR),
                },
                {
                  headerName: "Cantidad",
                  field: "CONTEO_ANTERIOR",
                  sortable: false,
                  headerClass: 'headerBlue',
                  maxWidth: 120
                },
              ]
            },
          ]
        },
        {
          headerName: '',
          headerClass: 'headerCenter',
          children: [
            {
              headerName: 'Diferencias',
              headerClass: 'headerCenter',
              children: [
                {
                  headerName: '',
                  headerClass: 'headerBlue',
                  maxWidth: 26,
                  cellRenderer: params => {
                    if (Math.sign(params.data.DIFERENCIA_SUMA) == 1) {
                      return `<img src="/conditional/arrow-up.svg" style="width: 16px; height: 16px;">`;
                    }
                    if (Math.sign(params.data.DIFERENCIA_SUMA) == -1) {
                      return `<img src="/conditional/arrow-down.svg" style="width: 16px; height: 16px;">`;
                    }
                    if (Math.sign(params.data.DIFERENCIA_SUMA) == 0) {
                      return ;
                    }
                    return null;
                  },
                },
                {
                  headerName: "En Monto",
                  field: "DIFERENCIA_SUMA",
                  sortable: false,
                  headerClass: 'headerBlue',
                  width: '150px',
                  cellClass: 'numberType',
                  cellClassRules: {
                    'redContentCell': params => Math.sign(params.value) === -1,
                    'greenContentCell': params => Math.sign(params.value) === 1,
                  },

                },
                {
                  headerName: '',
                  headerClass: 'headerBlue',
                  field: 'INDICADOR1',
                  maxWidth: 26,
                  cellRenderer: params => {
                    if (Math.sign(params.data.DIFERENCIA_CONTEO) == 1) {
                      return `<img src="/conditional/arrow-up.svg" style="width: 16px; height: 16px;">`;
                    }
                    if (Math.sign(params.data.DIFERENCIA_CONTEO) == -1) {
                      return `<img src="/conditional/arrow-down.svg" style="width: 16px; height: 16px;">`;
                    }
                    if (Math.sign(params.data.DIFERENCIA_CONTEO) == 0) {
                      return ;
                    }
                    return null;
                  },
                },
                {
                  headerName: "En Cantidad",
                  field: "DIFERENCIA_CONTEO",
                  sortable: false,
                  headerClass: 'headerBlue',
                  maxWidth: 140,
                  cellClassRules: {
                    'redContentCell': params => Math.sign(params.value) === -1,
                    'greenContentCell': params => Math.sign(params.value) === 1,
                  },
                },
              ]
            },
          ]
        },
      ],
      defaultExcelExportParams: null,
      searchTerm: "",
      loading: false,
      rows: '',
      atoms: [], // Array to store atoms from JSON file
      atomsFields: [], // Array to store atom fields from JSON file
      atomsSumFields: [],
      selectedAtom: null, // Selected atom ID
      selectedAtomField: null, // Selected atom field
      selectedSumAtom: null, // Selected atom field
      filtered: [],
      filteredSum: [],
      filteredSumFinal: [],
      titleSum: '',
      atomTitle: '',
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
  created() {

  },
  mounted() {
    this.getSelectData()
    this.generateInitialReport()
  },
  watch: {
    selectedAtom(val) {
      console.log('Actualizo a: ', val.ID_ATOMO)
      this.filteredAtomFields(val.ID_ATOMO)
      this.gridApi.refreshCells();
    },
    selectedAtomField(value) {
      console.log('Actualizo a: ', value.CAMPO)
      this.selectedSumAtom = null
      this.filteredAtomSum(value.CAMPO, value.ID_ATOMO)
      this.gridApi.refreshCells();
    }
  },
  methods: {
    async getSelectData() {
      try {
        this.loading = true;
        const resData = await this.$http.post(
            environment.uri + "/reportes/validator/code/000",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.fechaCorte,
              idAtomo: 2,

            })
        this.atoms = resData.data.atoms;
        this.atomsFields = resData.data.atomsFields;
        this.atomsSumFields = resData.data.atomsSumFields;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async generateInitialReport() {
      try {
        this.loading = true;
        const res = await this.$http.post(
            environment.uri + "/reportes/validator/code/100/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
              idAtomo: 21,
              campoComparacion: 'COD_REGION_SB03',
              campoSumatoria: 'MONTO',
              inputData: 'Átomo Contable'
            })
        this.rows = res.data.record
        this.titleSum = res.data.input.campoSumatoria.replaceAll('_', ' ')
        this.atomTitle = res.data.input.inputData
        this.apiMessage = res.data.message
        let stylesData = store.getters["app/getBankData"].filter(function (item) {
          return item.value === store.getters["app/getSelectedBank"]
        });
        this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`, 'Átomo Contable - COD-REGION-SB03')

      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async generateReport() {
      try {
        this.loading = true;
        const res = await this.$http.post(
            environment.uri + "/reportes/validator/code/100/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.fechaCorte,
              idAtomo: this.selectedAtom.ID_ATOMO,
              campoComparacion: this.selectedAtomField.CAMPO,
              campoSumatoria: this.selectedSumAtom.CAMPO_SUMA,
              inputData: this.selectedAtom
            })
        this.rows = res.data.record
        this.titleSum = res.data.input.campoSumatoria.replaceAll('_', ' ')
        this.atomTitle = res.data.input.inputData.DESCRIPCION
        this.apiMessage = res.data.message
        let stylesData = store.getters["app/getBankData"].filter(function (item) {
          return item.value === store.getters["app/getSelectedBank"]
        });
        this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`, `${this.selectedAtom.DESCRIPCION} - ${this.selectedAtomField.CAMPO}`)

        this.gridApi.refreshHeader()
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
        document.getElementById("mainView").scrollIntoView({behavior: 'smooth'})
      }
    },

    filteredAtomFields(e) {
      this.filtered = this.atomsFields.filter(field => field.ID_ATOMO === e);
      console.log('valor: ', e)
      console.log('filtrados: ', this.filtered)
      this.selectedAtomField = null
      this.selectedSumAtom = null
    },
    filteredAtomSum(y, z) {
      this.filteredSum = this.atomsSumFields.filter(field => field.CAMPO === y);
      console.log('SUM: ', y + z)
      this.filteredSumFinal = this.filteredSum.filter(field => field.ID_ATOMO === z);
      console.log('final: ', this.filteredSumFinal)
      this.selectedSumAtom = null
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
    fechaActualHeader() {
      return this.rows[0].FECHA_ACTUAL.substring(0, 10)
    },
    fechaAnteriorHeader() {
      return this.rows[0].FECHA_ANTERIOR.substring(0, 10)
    },
    campoSumatoriaheader() {
      return 'Campo Sumatoria ' + this.titleSum
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
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";


</style>

