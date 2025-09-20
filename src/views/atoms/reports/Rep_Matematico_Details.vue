<template>
  <b-card-code :title="`Detalles Reporte Matemático - Regla #${this.$route.query.numRegla}`">
    <div class="pb-2">{{this.$route.query.ruleDetails}}</div>
    <b-row>
      <b-col>
        <b-button
            variant="outline-primary"
            title="Regresar"
            @click="$router.go(-1)"
        >
          <feather-icon icon="ArrowLeftIcon"/>
          <span>Regresar</span>
        </b-button>
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
          <b-row>
            <b-col>
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
  name: "Rep_Matematico.vue",
  components: {
    AgGridVue,
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
    VueGoodTable
  },
  data() {
    return {
      columns: [
        {
          headerName: "",
          field: "COMPARACION",
          headerClass: "headerBlue",
          cellClass: 'stringType',
          headerValueGetter: (params) => {
            return this.head1
          }
        },
        {
          headerName: "Monto 1",
          field: "MONTO1",
          headerClass: "headerBlue",
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MONTO1),
          headerValueGetter: (params) => {
            return 'Monto ' + this.head2
          }
        },
        {
          headerName: "Monto 2",
          field: "MONTO2",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.MONTO2),
          headerValueGetter: (params) => {
            return 'Monto ' + this.head3
          }

        },
        {
          headerName: "Diferencia",
          field: "DIFERENCIA",
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.DIFERENCIA),
        },
      ],
      loading: false,
      rows: '',
      apiMessage: '',
      gridOptions: gridDef(),
      head1: '',
      head2: '',
      head3: ''
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
    this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `Detalles Reporte Matemático al ${this.$store.getters["app/getFechaCorte"]}`, `Regla # ${this.$route.query.numRegla}: ${this.$route.query.ruleDetails} `)
  },
  mounted() {
    this.generateReport()
  },
  methods: {
    async generateReport() {
      try {
        this.loading = true;
        const res = await this.$http.post(
            environment.uri + "/reportes/validator/code/1001/",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: this.$store.getters["app/getFechaCorte"],
              numRegla: this.$route.query.numRegla
            })
        this.rows = res.data.record
        this.apiMessage = res.data.message
        this.head1 = this.rows[0].CAMPO_COMPARACION
        this.head2 = this.rows[0].ATOMO1
        this.head3 = this.rows[0].ATOMO2
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
        document.getElementById("mainView").scrollIntoView({behavior: 'smooth'});
      }
    },
    onBtExport() {
      let params = {
        fileName: `Reporte_Matematico_Detalles_Regla_${this.$route.query.numRegla}-${this.getCurrentDateTime()}.xlsx`,
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



