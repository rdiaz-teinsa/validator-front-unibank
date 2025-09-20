<template>
  <b-card-code title="">
    <b-row>
      <b-col md="12">
        <h3 class="text-capitalize">
          Átomos {{ frequency.title }} {{ value }} : {{ selectedRowsx }}
        </h3>

        <span class="font-small-3"
        >Seleccione el tipo de corrida para iniciar el proceso de
          validación. - </span
        >
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col md="3" class="">
        <b-form-group>
          <v-select
              v-model="selectedRunType"
              :clearable="false"
              :options="runType"
              label="title"
              placeholder="Tipo de Corrida"
          >
            <template #option="{ title, icon }">
              <feather-icon :icon="icon" size="16" class="align-middle mr-50"/>
              <span> {{ title }}</span>
            </template>
          </v-select>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-button variant="primary" @click="register">Crear Periodo</b-button>
      </b-col>
    </b-row>

    <b-row></b-row>
    <hr class="mt-2 mb-2"/>
    <div v-html="errorMsg" class="errorMsg" v-if="errorMsg"></div>
    <div v-if="creado">
      <b-row>
        <b-col md="12">
          <b-alert variant="primary" show>
            <div class="alert-body">
              <feather-icon
                  icon="InfoIcon"
                  size="16"
                  class="mr-2"
                  v-b-popover.hover.html.right="{
                customClass: 'classPop',
                title: 'Cargar Átomos',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                html: true,
              }"
              />
              <span class="font-weight-light"
              >Seleccione Átomos a Cargar y presione el botónx</span
              >
            </div>
          </b-alert>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button
              variant="outline-primary"
              class="mb-2"
              :disabled="rowSelection.length <= 0"
              @click="importData()"
          >
            <feather-icon icon="DownloadIcon" class="mr-2"></feather-icon>
            <span v-if="!loading" class="align-middle"
            >Cargar {{ rowSelection.length }} Átomo<span
                v-if="rowSelection.length > 1"
            >s</span
            ></span
            >
            <span v-if="loading">Cargando...</span>
          </b-button>
          <feather-icon
              icon="InfoIcon"
              size="16"
              class="ml-2 mb-1"
              v-b-popover.hover.html.right="{
            customClass: 'classPop',
            title: 'Cargar Átomos',
            content:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            html: true,
          }"
          />
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
                <b-button v-on:click="onBtExport()" class="btn" variant="primary">
                  <feather-icon
                      icon="DownloadIcon"
                      class="mr-50"
                  />
                  <span class="align-middle">Exportar a Excel</span></b-button>
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
                         :rowSelection="rowSelection"
                         :suppressRowClickSelection="true"
                         :isRowSelectable="isRowSelectable"
                         :excelStyles="this.gridOptions.excelStyles"
                         :groupSelectsChildren="true"
                         :pagination="true"
                         :paginationPageSize="this.gridOptions.paginationPageSize"
                         :rowData="rows"
                         :defaultExcelExportParams="this.gridOptions.defaultExcelExportParams"
                         :cacheQuickFilter="true"
                         @selectionChanged="onSelectionChanged"
                         >
            </ag-grid-vue>
          </b-col>
        </b-row>
      </div>
      <b-row v-else-if="apiMessage">
        <b-col class="text-primary apiMessage">
          {{ apiMessage }}
        </b-col>
      </b-row>
    </div>
  </b-card-code>
</template>

<script>
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import {BFormDatepicker, VBPopover} from "bootstrap-vue";
import {
  BCol,
  BRow,
  BButton,
  BProgress,
  BMedia,
  BCardText,
  BAvatar,
  BMediaAside,
  BMediaBody,
  BAlert,
  BBadge,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BDropdown,
  BDropdownItem,
} from "bootstrap-vue";
import {VueGoodTable} from "vue-good-table";
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Ripple from "vue-ripple-directive";
import environment from "@/environment";

import {mapGetters} from "vuex";
import {AgGridVue} from "ag-grid-vue";
import {gridDef} from "@/views/atoms/reports/ag-grid-def";
import store from "@/store";

export default {
  name: "test",
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
    vSelect,
    BFormDatepicker,
    BAlert,
  },

  directives: {
    "b-popover": VBPopover,
    Ripple,
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("userData")),
      pageLength: 25,
      dir: false,
      // selected: {title: 'Tipo de Corrida', value: null},
      runType: [
        {
          title: "SBP",
          value: "SBP",
          icon: "HomeIcon",
        },
      ],
      selectedRunType: 'SBP',
      selectedDate: "",
      locale: "es-US",
      frequency: {},
      columns: [
        {
          headerName: "Id",
          field: "ID_ATOMO",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          showDisabledCheckboxes: true,
        },
        {
          headerName: "Átomo",
          field: "ATOMO",
        },
        {
          headerName: "Descripción",
          field: "DESCRIPCION",
        },
        {
          headerName: "Cant. Registros",
          field: "REG_TOTALES",
        },
        {
          headerName: "Periodo",
          field: "PERIODO",
        },
        {
          headerName: "Err. Estructurales",
          field: "ERR_ESTRUCTURALES",
        },
        {
          headerName: "Err. Funcionales",
          field: "ERR_FUNCIONALES",
        },
        {
          headerName: "Reg. Correctos",
          field: "REG_CORRECTOS",
        },
        {
          headerName: "Status",
          field: "STATUS",
        },
        {
          headerName: "",
          field: "action",
        },
      ],
      rows: [],
      rowSelection: [],
      value: null,
      loading: false,
      creado: false,
      errorMsg: '',
      apiMessage: '',
      isRowSelectable: null,
      gridOptions: gridDef(),
      selectedRowsx: []

    };
  },
  beforeMount() {
    let stylesData = store.getters["app/getBankData"].filter(function (item) {
      return item.value === store.getters["app/getSelectedBank"]
    });
    this.gridOptions = gridDef(stylesData[0].logo, stylesData[0].color_primary, `${this.$route.query.report} al ${this.$store.getters["app/getFechaCorte"]}`)
  },
  created() {
    this.load();
    this.rowSelection = 'multiple';
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        0: "light-primary",
        Professional: "light-success",
        Rejected: "light-danger",
        Resigned: "light-warning",
        Applied: "light-info",
        /* eslint-enable key-spacing */
      };
      return (status) => statusColor[status];
    },
    ...mapGetters({
      fechaCorte: "app/getFechaCorte",
      licencia: "app/getSelectedBank",
    }),
    /**
     * Activar o desactivar el boton de registrar
     */
    permitirRegistrar: function () {
      return (
          this.licencia !== null &&
          (this.licencia.value !== null || this.licencia.value !== undefined) &&
          this.fechaCorte !== null &&
          this.fechaCorte.length > 8 &&
          (this.selectedRunType.value !== null || this.selectedRunType.value !== undefined) &&
          this.creado == true
      );
    },
    /**
     * El valor seleccionado para "Tipo de Corrida"
     */
    selected: {
      get: function () {
        return this.$store.state.app.atomo_tipo_corrida;
      },
      set: function (value) {
        this.$store.commit("app/UPDATE_ATOMO_TIPO_CORRIDA", value);
      },
    },
  },
  methods: {
    async register() {
      try {
        if (!this.permitirRegistrar) {
          this.creado = true;
          // const list = this.$refs["table"].selectedRows || [];
          const dateF = this.fechaCorte.replaceAll("-", "");
          this.loading = true;
          const res1 = await this.$http.post(
              environment.uri + "/validador/periodo",
              {
                codBanco: this.$store.getters["app/getSelectedBank"],
                fechaCorte: dateF,
                frecuencia: this.$route.query.group,
                tipoCorrida: this.selectedRunType.value,
                usuario: this.user.userData.username,
                ejecutables: 0
                /*ejecutables: list.reduce((prev, curr) => {
                  let val = prev;
                  if (val) {
                    val = val + ", " + curr.ID_ATOMO;
                  } else {
                    val = curr.ID_ATOMO;
                  }
                  return val;
                }, null),*/
              }
          );

          this.rows = res1.data;
          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              title: `El Periodo fue creado con éxito.`,
              icon: "BellIcon",
              variant: "success",
            },
          });
        }
      } catch (err) {
        console.error(err);
        this.$toast({
          component: ToastificationContent,
          position: "top-right",
          props: {
            title: `Algo salió mal, vuelve a intentarlo`,
            icon: "BellIcon",
            variant: "danger",
          },
        });
      } finally {
        this.loading = false;
      }
    },
    async importData() {
      try {
        this.errorMsg = ''
        const list = this.$refs["table"].selectedRows;
        const dateF = this.fechaCorte.replaceAll("-", "");
        this.loading = true;
        const res2 = await this.$http.post(
            environment.uri + "/validador/periodo/importar",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              fechaCorte: dateF,
              frecuencia: this.$route.query.group,
              usuario: this.user.userData.username,
              os: "LIX",
              idPeriodo:
                  this.$store.getters["app/getSelectedBank"] +
                  "-" +
                  this.$route.query.group +
                  "-" +
                  dateF,
              ejecutables:
                  list.reduce((prev, curr) => {
                    let val = prev;
                    if (val) {
                      val = val + ", " + curr.ID_ATOMO;
                    } else {
                      val = curr.ID_ATOMO;
                    }
                    return val;
                  }, null).toString(),
            }
        );

        this.rows = res2.data;

        this.$toast({
          component: ToastificationContent,
          position: "top-right",
          props: {
            title: `Ejecutado`,
            icon: "BellIcon",
            variant: "success",
          },
        });
      } catch (err) {
        console.error(err);
        this.errorMsg = err +
            '<br>' +
            '<ul>';
        for (let i = 0; i < err.response.data.message.precedingErrors.length; ++i) {
          this.errorMsg += '<li>' + err.response.data.message.precedingErrors[i].originalError.info.message + '</li>';
        }
        this.errorMsg += '</ul>';
        this.errorMsg += '<br>' +
            err.response.data.message.originalError.info.message
        this.$toast({
          component: ToastificationContent,
          position: "top-right",
          props: {
            title: `Algo salió mal, vuelve a intentarlo`,
            icon: "BellIcon",
            variant: "danger",
          },
        });
      } finally {
        this.loading = false;
      }
    },
    async exec() {
      try {
        const list = this.$refs["table"].selectedRows;
        const dateF = this.fechaCorte.replaceAll("-", "");
        this.loading = true;
        await this.$http.post(environment.uri + "/validador/periodo", {
          codBanco: this.$store.getters["app/getSelectedBank"],
          fechaCorte: dateF,
          frecuencia: this.$route.query.group,
          tipoCorrida: this.selected.value,
          usuario: this.user.userData.username,
          ejecutables: list.reduce((prev, curr) => {
            let val = prev;
            if (val) {
              val = val + ", " + curr.ID_ATOMO;
            } else {
              val = curr.ID_ATOMO;
            }

            return val;
          }, null),
        });
        const res2 = await this.$http.post(
            environment.uri + "/validador/periodo/importar",
            {
              codBanco: this.$store.getters["app/getSelectedBank"],
              idPeriodo:
                  this.$store.getters["app/getSelectedBank"] +
                  "-" +
                  this.$route.query.group +
                  "-" +
                  dateF,
              fechaCorte: dateF,
              frecuencia: this.$route.query.group,
              usuario: this.user.userData.username,
              os: "LIX",
            }
        );

        this.rows = res2.data;

        this.$toast({
          component: ToastificationContent,
          position: "top-right",
          props: {
            title: `Ejecutado`,
            icon: "BellIcon",
            variant: "success",
          },
        });
      } catch (err) {
        console.error(err);
        this.$toast({
          component: ToastificationContent,
          position: "top-right",
          props: {
            title: `Algo salió mal, vuelve a intentarlo`,
            icon: "BellIcon",
            variant: "danger",
          },
        });
      } finally {
        this.loading = false;
      }
    },
    async load() {
      try {
        this.loading = true;
        const dateF = this.fechaCorte.replaceAll("-", "");
        let idPeriodo = this.$store.getters["app/getSelectedBank"] + "-" + this.$route.query.group + "-" + dateF
        const {data} = await this.$http.get(environment.uri + '/validador/procesos/frecuencia/' + this.$route.query.group + '/periodo/' + idPeriodo)
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    selectionChanged(params) {
      this.rowSelection = params.selectedRows;
    },
    showErrorDetails(atomData) {
      this.errorMsg = '<ul>';
      this.errorMsg += '<li>Code: ' + atomData.ERROR_NUMBER + '</li>';
      this.errorMsg += '<li>Severity: ' + atomData.ERROR_SEVERITY + '</li>';
      this.errorMsg += '<li>State: ' + atomData.ERROR_STATE + '</li>';
      this.errorMsg += '<li>Procedure: ' + atomData.ERROR_PROCEDURE + '</li>';
      this.errorMsg += '<li>Line: ' + atomData.ERROR_LINE + '</li>';
      this.errorMsg += '<li>Message: ' + atomData.ERROR_MESSAGE + '</li>';
      this.errorMsg = '</ul>';

      this.$toast({
        component: ToastificationContent,
        position: "top-right",
        props: {
          title: `Detalle del Error de Carga`,
          icon: "BellIcon",
          variant: "danger",
        },
      })
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
    onSelectionChanged(event) {
      this.selectedRowsx = event.api.getSelectedRows();
    },
  },
};
</script>

<style lang="scss">
@import "~ag-grid-community/styles/ag-grid.css";
@import "~ag-grid-community/styles/ag-theme-alpine.css";

.infoRowClass {
  background: #f3f3f3;
  font-weight: normal;
  font-size: 14px;

}

.infoRowClass a {
  display: none;
}

.infoRowClass .vgt-pull-right {
  float: none !important;
  margin: 10px 0;
}

.status0:after {
  content: "Pendiente";
  background-color: #8fc4cb;
  color: #ffffff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status1:after {
  content: "Archivo No Encontrado";
  background-color: #dc3737;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status2:after {
  content: "Cargado";
  background-color: #97d297;
  color: #413a3a;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status3:after {
  content: "Validado";
  background-color: #03520a;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status4:after {
  content: "Certificado";
  background-color: #003064;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}

.status5:after {
  content: "Aprobado";
  background-color: #003f00;
  color: #fff;
  font-size: 0.8em;
  font-weight: 700;
  padding: 5px;
  border-radius: 3px;
}
</style>
