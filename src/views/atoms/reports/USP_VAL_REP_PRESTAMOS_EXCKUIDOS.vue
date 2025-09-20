<template>
  <b-card-code :title="this.$route.query.report">
    <b-row>
      <b-col md="2">
        <b-form-group>
          <b-form-datepicker
              id="date-select"
              class="mb-1"
              disabled
              :placeholder=this.$store.state.app.fechaCorte
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              locale="es"
          />
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group>
          <v-select
              v-model="selectedAtomo"
              label="text"
              :options="[{ text: 'Átomo a Evaluar', value: 0 },{ text: 'AT03', value: 1 }, { text: 'AT03 CINU', value: 2 }]"
              :reduce="option => option.value"
          />
        </b-form-group>
      </b-col>
      <b-col md="5">
        <b-form-group>
          <v-select
              v-model="selectedRule"
              label="DESCRIPCION"
              :options="rules"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-button :disabled="selectedRule === 'Reglas' || selectedAtomo === 0" variant="primary" @click="generateReport">Generar Reporte</b-button>
      </b-col>
    </b-row>
    <hr class="mb-1" id="mainView">
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
    AgGridVue
  },
  data() {
    return {
      extraRowContainer: false,
      cutOffDate: '2020-06-30',
      columns: [
        {
          headerName: "Nº Préstamo",
          field: "NUMERO_PRESTAMO",
          headerClass: 'headerBlue',
          cellClass: 'stringType',
        },
        {
          headerName: "Nº Error",
          field: "NUMERO_ERROR",
          headerClass: 'headerBlue',
          cellClass: 'stringType',
        },
        {
          headerName: "Nombre Cliente",
          field: "NOMBRE_CLIENTE",
          headerClass: 'headerBlue',
          cellClass: 'stringType',
        },
        {
          headerName: "Descripción Error",
          field: "DESCRIPCION",
          cellClass: 'stringType',
          sortable: false,
          headerClass: 'headerBlue',
        },
        {
          headerName: "Saldo",
          field: "SALDO",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.SALDO),
        },
        {
          headerName: "Categoría Cambio SB120",
          field: "CATEGORIA_CAMBIO_SB120",
          headerClass: 'headerBlue',
          cellClass: 'stringType',
        },
      ],
      searchTerm: "",
      loading: false,
      rows: '',
      apiMessage: '',
      gridOptions: gridDef(),
      selectedRule: 'Reglas',
      rules: [],
      selectedAtomo: 0
    }
  },
  computed: {
    ...mapGetters({
      fechaCorte: "app/getFechaCorte",
      licencia: "app/getSelectedBank",
    }),
  },
  created() {
    this.loadRules()
    let stylesData = store.getters["app/getBankData"].filter(function (item) {
      return item.value === store.getters["app/getSelectedBank"]
    });
    this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`)
  },
  methods: {
    async loadRules() {
      try {
        this.loading = true;
        const rules = await this.$http.post(
            environment.uri + "/reportes/validator/code/001/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
            })
        this.rules = rules.data.record
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
            environment.uri + "/reportes/validator/code/775/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
              idAtomo :this.selectedAtomo,
              numRegla: this.selectedRule.ID_VALIDACION
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

