<template>
  <section id="dashboard">

    <div v-if="this.$store.state.app.selectedBank !== null && this.$store.state.app.fechaCorte !== null">

      <b-row class="match-height">
        <b-col
            xl="12"
            md="12"
        >
        </b-col>
      </b-row>
      <b-row class="match-height">
        <b-col md="12">
          <b-card>
            <b-card-header>
              <b-card-title>Átomos Disponibles</b-card-title>
              <b-card-text class="font-small-2 mr-25 mb-0" v-if="selectedBank">
                {{ selectedBank.text }}
              </b-card-text>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12" class="text-right mb-2">
                  <a href="../Sistema_de_Validador_de_Atomos_Manual_de_Usuario v1.0.pdf" target="_blank">Documentación</a>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="3" class="mb-1">
                  <b-button
                      variant="primary"
                      size="lg"
                      block
                      @click="navigate('atom-available', '001', 'Semanales')">
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">Átomos Semanales</span>
                  </b-button>

                </b-col>
                <b-col md="3" class="mb-1">
                  <b-button

                      variant="primary"
                      block
                      @click="navigate('atom-available', '002', 'Mensuales')"
                      size="lg" block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">
                                      Átomos Mensuales</span>
                  </b-button>
                </b-col>
                <b-col md="3" class="mb-1">
                  <b-button

                      @click="navigate('atom-available', '003', 'Trimestrales')"
                      variant="primary" size="lg" block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">Átomos Trimestrales</span>
                  </b-button>
                </b-col>
                <b-col md="3" class="mb-1">
                  <b-button
                      @click="navigate('atom-available', '004', 'Semestrales')"
                      variant="primary" size="lg" block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">
                                      Átomos Semestrales</span>
                  </b-button>
                </b-col>
                <b-col md="3" class="mb-1">
                  <b-button
                      @click="navigate('atom-available', '005', 'Anual')"
                      variant="primary" size="lg" block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">
                                      Átomos Anual</span>
                  </b-button>
                </b-col>
                <!--BANS-->
                <b-col md="3" class="mb-1">
                  <b-button
                      variant="info"
                      @click="navigate('atom-available', '006', 'Ban Mensual')"
                      size="lg"  block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">
                                      BAN Mensual</span>
                  </b-button>
                </b-col>
                <b-col md="3" class="mb-1">
                  <b-button
                      @click="navigate('atom-available', '007', 'BAN Trimestral')"
                      variant="info" size="lg" block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">
                                      BAN Trimestrales</span>
                  </b-button>
                </b-col>
                <b-col md="3" class="mb-1">
                  <b-button
                      @click="navigate('atom-available', '008', 'BAN Semestral')"
                      variant="info" size="lg" block>
                    <feather-icon
                        icon="CalendarIcon"
                        class="mr-50" style="width: 27px; height: 27px;"
                    />
                    <span class="align-middle">
                                      BAN Semestrales</span>
                  </b-button>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
          <b-card >
            <b-card-header>
              <b-card-title>Bitácora de Atomos</b-card-title>
            </b-card-header>
            <b-card-body :style="{ height: logTableHeight + 'px' }">
              <b-row>
                <b-col md="3" class="">
                  <b-form-group>
                    <v-select
                        v-model="selectedAtom"
                        :clearable="false"
                        :options="atomsCatalog"
                        label="ATOMO"
                        placeholder=""
                        @input="getBankLoadedAtomsBoard(selectedAtom)"
                    >
                      <template #option="{ ATOMO}">
                        <span> {{ ATOMO }}</span>
                      </template>
                    </v-select>

                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="mt-2 mb-4">
                <b-col xl="3" sm="3">
                  <b-media no-body>
                    <b-media-aside class="mr-2">
                      <b-avatar size="64" variant="light-info">
                        <feather-icon size="38" icon="CoffeeIcon" class=""/>
                      </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto" v-if="indicatorBoard !== null">
                      <h3 class="font-weight-bolder mb-0">{{ indicatorBoard[0].Sin_Validar }}</h3>
                      <b-card-text class="font-small-4 mb-0"> Sin Validar</b-card-text>
                    </b-media-body>
                  </b-media>
                </b-col>
                <b-col xl="3" sm="3">
                  <b-media no-body>
                    <b-media-aside class="mr-2">
                      <b-avatar size="64" variant="light-info">
                        <feather-icon
                            size="38"
                            icon="CheckCircleIcon"
                            class="text-success"
                        />
                      </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto" v-if="indicatorBoard !== null">
                      <h3 class="font-weight-bolder mb-0">{{ indicatorBoard[0].Sin_Errores }}</h3>
                      <b-card-text class="font-small-4 mb-0"> Sin Errores</b-card-text>
                    </b-media-body>
                  </b-media>
                </b-col>
                <b-col xl="3" sm="3" class="">
                  <b-media no-body>
                    <b-media-aside class="mr-2">
                      <b-avatar size="64" variant="light-info">
                        <feather-icon
                            size="38"
                            icon="AlertCircleIcon"
                            class="text-danger"
                        />
                      </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto" v-if="indicatorBoard !== null">
                      <h3 class="font-weight-bolder mb-0">
                        {{ indicatorBoard[0].Funcionales }}
                      </h3>
                      <b-card-text class="font-small-4 mb-0">
                        Errores Funcionales
                      </b-card-text>
                    </b-media-body>
                  </b-media>
                </b-col>
                <b-col xl="3" sm="3" class="">
                  <b-media no-body>
                    <b-media-aside class="mr-2">
                      <b-avatar size="64" variant="light-info">
                        <feather-icon
                            size="38"
                            icon="GitPullRequestIcon"
                            class="text-danger"
                        />
                      </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto" v-if="indicatorBoard !== null">
                      <h3 class="font-weight-bolder mb-0">
                        {{ indicatorBoard[0].Estructurales }}
                      </h3>
                      <b-card-text class="font-small-4 mb-0"> Estructural</b-card-text>
                    </b-media-body>
                  </b-media>
                </b-col>
              </b-row>
              <!--Bitacora Table-->
              <div id="logContentTable">
                <ag-grid-vue style="width: 100%; height: 650px;"
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
                             :rowData="loadedAtoms"
                             :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
                             :cacheQuickFilter="true">
                </ag-grid-vue>
              </div>

            </b-card-body>
          </b-card>
        </b-col>
      </b-row>


    </div>
    <!--  No Licence Modal-->
    <b-modal
        ref="noLicenceModal"
        id="modal-1"
        title="Antes de Empezar"
        ok-only
        ok-title="Ok"
    >
      <b-card-text>
        Asegure haber selecionado la licencia a utilizar y la fecha corte.
      </b-card-text>
    </b-modal>
  </section>
</template>

<script>
import {
  VBPopover,
  BButton,
  BRow,
  BCol,
  BCard,
  BCardHeader,
  BCardTitle,
  BCardText,
  BCardBody,
  BDropdown,
  BDropdownItem,
  BModal, BFormGroup, BMediaAside, BMediaBody, BMedia, BAvatar, BPagination, BFormSelect, BBadge,
} from 'bootstrap-vue'
/*
import ChartsCartera from "@/views/atoms/dashboard/charts/ChartsCartera.vue";
import ChartsPrestamos from "@/views/atoms/dashboard/charts/ChartsPrestamos.vue";
import ChartsFacilidadGenero from "@/views/atoms/dashboard/charts/ChartsFacilidadGenero.vue";
import ChartsFacilidadRegion from "@/views/atoms/dashboard/charts/ChartsFacilidadRegion.vue";
*/

import {getUserData} from '@/auth/utils'
import Products from './Products.vue'
import Statistics from './Statistics.vue'
import Ripple from 'vue-ripple-directive'

import {mapGetters} from 'vuex'
import vSelect from "vue-select";
import environment from "@/environment";

import {VueGoodTable} from "vue-good-table";
import store from "@/store";
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
import {AgGridVue} from "ag-grid-vue";

export default {
  components: {
    // ChartsCartera, ChartsPrestamos, ChartsFacilidadGenero, ChartsFacilidadRegion,
    AgGridVue,
    BBadge, BFormSelect, BPagination,
    BAvatar, BMedia, BMediaBody, BMediaAside,
    vSelect, BFormGroup,
    BRow,
    BCol,
    BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BDropdown, BDropdownItem,
    Statistics,
    Products,
    BButton,
    BModal,
    VueGoodTable,
  },
  directives: {
    'b-popover': VBPopover,
    Ripple,
  },
  data() {
    return {
      selectedAtom: {
        ATOMO: 'AT02'
      },
      atomsCatalog: [],
      loadedAtoms: [],
      indicatorBoard: null,
      data: {},
      loading: true,
      columns: [
        {
          headerName: "Átomo",
          field: "Atomo",
        },
        {
          headerName:  "Fecha Corte",
          field: "Fecha_Sib",
          width: "100px"
        },
        {
          headerName:  "Cantidad",
          field: "Cantidad",
          width: "100px"
        },
      ],
      pageLength: 50,
      logo: '',
      gridOptions: gridDef(),
      logTableHeight: ''
    }
  },
  created() {
    this.$http.get('/atoms/data')
        .then(response => {
          this.data = response.data
          const userData = getUserData()
        })
    this.getBankLoadedAtoms()
    this.getBankLoadedAtomsBoard(this.selectedAtom)
    this.loadAtoms()
  },
  beforeMount() {
    let stylesData = store.getters["app/getBankData"].filter(function (item) {
      return item.value === store.getters["app/getSelectedBank"]
    });
    this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`)  },
  mounted() {
    this.showModal()
    this.matchHeight()
    this.logo = store.getters["app/getBankData"].filter(function (item) {
      return item.value === store.getters["app/getSelectedBank"]
    });
  },
  methods: {
    matchHeight () {
      this.logTableHeight = document.getElementById("logContentTable").offsetHeight + 470;
    },
    rowStyleClassFn(row) {
      return row.COLOR === "#FF0000" ? "errorRow" : "";
    },
    navigate(e, p, f) {
      this.$router.push({path: '/atoms/atom-available/' + e, query: {group: p, frecuency: f}})
    },
    showModal() {
      if (this.$store.state.app.selectedBank === null) {
        this.$refs['noLicenceModal'].show()
      } else return
    },
    loadAtoms() {
      try {
        let atoms = this.$http.get(environment.uri + '/validador/atomos')
            .then((response) => {
              this.atomsCatalog = response.data
            })
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    getBankLoadedAtomsBoard(x) {
      try {
        if (this.$store.getters["app/getSelectedBank"] !== null) {
          let indicatorBoard = this.$http
              .post(environment.uri + "/validador/tablero", {
                codBanco: this.$store.getters["app/getSelectedBank"],
                atomo: this.selectedAtom.ATOMO,
                fechaSib: this.fechaCorte,
              })
              .then(response => {
                this.indicatorBoard = response.data
              })

        }

      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    getBankLoadedAtoms() {
      try {
        let loadedAtoms = this.$http.get(environment.uri + '/validador/bitacora/banco/' + this.$store.getters["app/getSelectedBank"])
            .then(response => {
              this.loadedAtoms = response.data
            })
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
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
  computed: {
    ...mapGetters({
      fechaCorte: 'app/getFechaCorte',
      selectedBank: 'app/getSelectedBank',
    }),
    selectedBank() {
      return this.$store.getters["app/getSelectedBank"]
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';

@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.classPop {
  width: 400px !important;
}

.popover {
  min-width: 500px !important;
}

</style>
