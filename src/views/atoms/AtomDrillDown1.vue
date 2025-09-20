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
        <h5 class="text-danger text-capitalize">ID Error: {{ $route.query.idError }}</h5>
        <h5 class="text-danger">{{ descError }}</h5>
      </b-col>
    </b-row>
    <b-row class="mt-2">
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
      <b-col class="text-right">

      </b-col>
    </b-row>
    <hr class="mt-2 mb-2">
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
  BCol, BRow, BButton, BProgress, BMedia, BCardText,
  BAvatar,
  BMediaAside,
  BMediaBody,
  BBadge, BPagination, BFormGroup, BFormInput, BFormSelect, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import {VueGoodTable} from "vue-good-table";
import store from "@/store";
import environment from "@/environment";
import {AgGridVue} from "ag-grid-vue";
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
export default {
  name: "AtomTemplate.vue",
  components: {
    AgGridVue,
    BCol,
    BRow,
    BButton,
    BProgress,
    BCardCode,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    VueGoodTable,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BCardText,
  },
  data() {
    return {
      pageLength: 50,
      dir: false,
      rows: '',
      columns: [
        {
          headerName: 'Registro #',
          field: 'No_Registro',
          cellClass: 'errorCell',
          headerClass: 'headerBlue',
        },
        {
          headerName: '',
          field: 'Campo1',
          headerClass: 'headerBlue',
        },
        {
          headerName: '',
          field: 'Campo2',
          headerClass: 'headerBlue',
          cellClass: 'numberType',
          valueFormatter: params => this.currencyFormatFn(params.data.Campo2),
        },
        {
          headerName: '',
          field: 'action',
          maxWidth: 120,
          cellRenderer: params => this.linkRendererDrill(params.data.Id_Atomo, params.data.No_Registro, params.data.ID_RECORD, params.data.Id_Error),
        },
      ],
      descError: '',
      gridOptions: gridDef(),
      apiMessage: ''
    }
  },

  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
    fechaCorte: function () {
      return this.$store.state.app.fechaCorte.replaceAll("-", "");
    },
  },
  created() {
    this.load()
  },
  beforeMount() {
    this.gridOptions = gridDef()
  },
  methods: {
    async load() {
      try {
        if (this.$route.query.tipo === 'estructural') {
          this.loading = true;
          const res = await this.$http.post(
              environment.uri + "/validador/estructural/detalle",
              {
                codBanco: this.$route.query.codBanco,
                fechaSib: this.$route.query.fechaSib,
                idAtomo: this.$route.query.idAtomo,
                idError: this.$route.query.idError,
                usuario: this.$route.query.usuario
              })
          this.rows = res.data
          this.apiMessage = res.data.message
          this.descError = res.data[0].Descripcion
          let stylesData = store.getters["app/getBankData"].filter(function (item) {
            return item.value === store.getters["app/getSelectedBank"]
          });
          this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.tipo}: ${this.$route.query.idError} - ${this.descError}`)

        } else {
          this.loading = true;
          const res = await this.$http.post(
              environment.uri + "/validador/funcional/detalle",
              {
                codBanco: this.$route.query.codBanco,
                fechaSib: this.$route.query.fechaSib,
                idAtomo: this.$route.query.idAtomo,
                idError: this.$route.query.idError,
              })
          this.rows = res.data
        }

      } catch (err) {
        console.error(err);
      } finally {
        const headerN1 = document.getElementsByClassName("campo1");
        headerN1[0].innerHTML = this.rows[0].Nombre1

        const headerN2 = document.getElementsByClassName("campo2");
        headerN2[0].innerHTML = this.rows[0].Nombre2

        this.loading = false;
      }
    },
    onBtExport() {
      let params = {
        columnWidth: 320,
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
    linkRendererDrill(idatm, idrec, idrecAct, iderr) {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = 'Detalles';
      link.className = 'detailsLink';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.$router.push( {path: '/atoms/atom-drill-details/',
          query: {
              codBanco: store.getters["app/getSelectedBank"],
              fechaSib: store.getters["app/getFechaCorte"],
              idAtomo : idatm,
              idRec : idrec,
              idRecActual : idrecAct,
              idValidacion : iderr,
              tipo: this.$route.query.tipo
        }
           });
      });
      return link;
    },
  }
}
</script>

<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";
</style>
