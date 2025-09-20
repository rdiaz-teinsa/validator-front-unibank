<template>
  <b-card-code title="">
    <b-row>
      <b-col md="12">
        <h3>Átomo {{ $route.query.idAtomo }}</h3>
        <span class="font-small-3"></span>
      </b-col>

    </b-row>
    <hr>
    <b-row>
      <b-col>
        <h4 class="text-capitalize">Errores Tipo {{ $route.query.tipo }}</h4>
        <h5 class="text-danger text-capitalize">Registro #: {{ $route.query.idRec }}</h5>
        <h5 class="text-danger">{{ descError }}</h5>
      </b-col>
    </b-row>
    <hr class="mt-2 mb-2">
    <b-row class="mb-2">
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
              <b-button v-on:click="onBtExport()" class="btn" variant="primary">Exportar a Excel</b-button>
            </b-col>
          </b-row>

          <ag-grid-vue style="width: 100%; height: 100%;"
                       class="ag-theme-alpine"
                       ref="agGrid"
                       @grid-ready="onGridReady"
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
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import {
  BTable, BCol, BRow, BButton, BProgress, BMedia, BCardText,
  BButtonGroup,
  BAvatar,
  BMediaAside,
  BMediaBody,
  BBadge, BPagination, BFormGroup, BFormInput, BFormSelect, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import store from "@/store";
import environment from "@/environment";
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
import {AgGridVue} from "ag-grid-vue";

export default {
  name: "AtomTemplate.vue",
  components: {
    BTable,
    BCol,
    BRow,
    BButton,
    BProgress,
    BCardCode,
    BMedia,
    BButtonGroup,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BCardText,
    AgGridVue
  },
  data() {
    return {
      columns: [
        {
          headerName: '',
          field: 'COLUMNA',
          headerClass: 'headerBlue',
          cellClass: params => this.cellErrorDisplay(params.data.ERROR),
          sortable: false
        },
        {
          headerName: 'VALOR',
          field: 'VALOR',
          headerClass: 'headerBlue',
          cellClassRules: { 'errorCell': params => params.data.ERROR > 0},
          cellClass: 'stringType',
          sortable: false
        },
      ],
      rows: '',
      descError: '',
      apiMessage: '',
      gridOptions: gridDef(),
    }
  },
  computed: {},
  created() {
    this.load(this.$route.query.tipo)
  },
  beforeMount() {
    this.gridOptions = gridDef()
  },
  methods: {
    async load(x) {
      try {
        this.loading = true;
        const res = await this.$http.post(
            environment.uri + "/validador/global/registro/" + x,
            {
              codBanco: this.$route.query.codBanco,
              fechaSib: this.$route.query.fechaSib,
              idAtomo: this.$route.query.idAtomo,
              idRec: this.$route.query.idRec,
              idRecActual: this.$route.query.idRecActual,
              idValidacion: this.$route.query.idValidacion,
            })
        this.rows = res.data
        this.apiMessage = res.data.message
        this.descError = res.data[0].Desc_Error
        let stylesData = store.getters["app/getBankData"].filter(function (item) {
          return item.value === store.getters["app/getSelectedBank"]
        });
        this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.tipo}: ${this.$route.query.idRec} - ${this.descError}`)
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    onBtExport() {
      let params = {
        columnWidth: 480,
        fileName: `err${this.$route.query.tipo}-${this.$route.query.idAtomo}-reg${this.$route.query.idRec}-${this.$route.query.fechaSib}-${this.getCurrentDateTime()}.xlsx`,
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
    rowStyleClassFn(row) {
      return row.ERROR === 1 ? "errorRow" : "";
    },

  }

}
</script>
<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.errorRow span {
  color: red !important;
}
</style>
