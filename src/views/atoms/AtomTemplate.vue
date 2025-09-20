<template>
    <b-card-code title="">
        <b-row>
            <b-col md="9">
                <h3>AT10 - Liquidez Semanal</h3>
                <span class="font-small-3">Átomos Semanales</span>
            </b-col>
            <b-col md="3" class="text-right">
                <router-link to="/atoms/atom-load">
                    <b-button
                            variant="outline-primary"
                    >
                        <feather-icon
                                icon="PlusCircleIcon"
                                class="mr-50"
                        />
                        <span class="align-middle">Cargar Atomo</span>
                    </b-button>
                </router-link>
            </b-col>
        </b-row>
        <b-row class="mt-2">
            <b-col>
                <div>
                    <b-progress
                            value="45"
                            max="100"
                            show-progress
                            variant="info"
                            class="progress-bar-info progress-height"
                    />
                </div>
            </b-col>
        </b-row>
        <b-row class="mt-4">
            <b-col
                    xl="3"
                    sm="3"
            >
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar
                                size="64"
                                variant="light-info"
                        >
                            <feather-icon size="38" icon="CoffeeIcon" class=""/>
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">
                            14
                        </h3>
                        <b-card-text class="font-small-4 mb-0">
                            Sin Validar
                        </b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
            <b-col
                    xl="3"
                    sm="3"
            >
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar
                                size="64"
                                variant="light-info"
                        >
                            <feather-icon size="38" icon="CheckCircleIcon" class="text-success"/>
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">
                            35
                        </h3>
                        <b-card-text class="font-small-4 mb-0">
                            Sin Errores
                        </b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
            <b-col
                    xl="3"
                    sm="3"
            >
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar
                                size="64"
                                variant="light-info"
                        >
                            <feather-icon size="38" icon="AlertCircleIcon" class="text-danger"/>
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">
                            14
                        </h3>
                        <b-card-text class="font-small-4 mb-0">
                            Errores Funcionales
                        </b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
            <b-col
                    xl="3"
                    sm="3"
            >
                <b-media no-body>
                    <b-media-aside class="mr-2">
                        <b-avatar
                                size="64"
                                variant="light-info"
                        >
                            <feather-icon size="38" icon="AlertCircleIcon" class="text-danger"/>
                        </b-avatar>
                    </b-media-aside>
                    <b-media-body class="my-auto">
                        <h3 class="font-weight-bolder mb-0">
                            14
                        </h3>
                        <b-card-text class="font-small-4 mb-0">
                            Sin Validar
                        </b-card-text>
                    </b-media-body>
                </b-media>
            </b-col>
        </b-row>
        <hr class="mt-2 mb-2">
        <b-row>
            <b-col>
                <!-- search input -->
                <div class="custom-search d-flex justify-content-end">
                    <b-form-group>
                        <div class="d-flex align-items-center">
                            <label class="mr-1">Buscar</label>
                            <b-form-input
                                    v-model="searchTerm"
                                    placeholder="Buscar"
                                    type="text"
                                    class="d-inline-block"
                            />
                        </div>
                    </b-form-group>
                </div>
                <!-- table -->
                <vue-good-table
                        :columns="columns"
                        :rows="rows"
                        :rtl="direction"
                        :search-options="{
        enabled: true,
        externalQuery: searchTerm }"
                        :pagination-options="{
        enabled: true,
        perPage:pageLength
      }"
                >
                    <template
                            slot="table-row"
                            slot-scope="props"
                    >
                        <!-- Column: Action -->
                        <span v-if="props.column.field === 'action'">
          <span>
            <router-link to="/atoms/atom-drill-down">
            <b-button variant="light"><feather-icon icon="EyeIcon"></feather-icon></b-button>
            </router-link>
          </span>
        </span>
                        <span v-else-if="props.column.field === 'errorQuantity'" class="text-center text-danger">
              <b-badge variant="danger"><h5 class="text-light">{{
                  props.formattedRow[props.column.field]
                  }}</h5></b-badge>
            </span>

                        <!-- Column: Common -->
                        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
                    </template>

                    <!-- pagination -->
                    <template
                            slot="pagination-bottom"
                            slot-scope="props"
                    >
                        <div class="d-flex justify-content-between flex-wrap">
                            <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap ">
              Mostrando 1 a
            </span>
                                <b-form-select
                                        v-model="pageLength"
                                        :options="['3','5','10']"
                                        class="mx-1"
                                        @input="(value)=>props.perPageChanged({currentPerPage:value})"
                                />
                                <span class="text-nowrap"> de {{ props.total }} registros </span>
                            </div>
                            <div>
                                <b-pagination
                                        :value="1"
                                        :total-rows="props.total"
                                        :per-page="pageLength"
                                        first-number
                                        last-number
                                        align="right"
                                        prev-class="prev-item"
                                        next-class="next-item"
                                        class="mt-1 mb-0"
                                        @input="(value)=>props.pageChanged({currentPage:value})"
                                >
                                    <template #prev-text>
                                        <feather-icon
                                                icon="ChevronLeftIcon"
                                                size="18"
                                        />
                                    </template>
                                    <template #next-text>
                                        <feather-icon
                                                icon="ChevronRightIcon"
                                                size="18"
                                        />
                                    </template>
                                </b-pagination>
                            </div>
                        </div>
                    </template>
                </vue-good-table>
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

export default {
    name: "AtomTemplate.vue",
    components: {
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
            pageLength: 3,
            dir: false,
            columns: [
                {
                    label: '',
                    field: 'id',
                },
                {
                    label: 'Cod',
                    field: 'errorCode',
                },
                {
                    label: 'Descripción',
                    field: 'descriptionCode',
                },
                {
                    label: 'Fecha',
                    field: 'date',
                },
                {
                    label: 'Tipo',
                    field: 'type',
                },
                {
                    label: 'Errores',
                    field: 'errorQuantity',
                    tdClass: 'text-center',
                },
                {
                    label: '',
                    field: 'action',
                },
            ],
            rows: [],
            searchTerm: '',
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
    },
    created() {
        this.$http.get('/atoms/general')
            .then(res => {
                this.rows = res.data
            })
    },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
