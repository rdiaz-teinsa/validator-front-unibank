<template>
    <b-card-code title="">
        <b-row>
            <b-col md="9">
                <h3>AT10 - Liquidez Semanal</h3>
                <span class="font-small-3">Átomos Semanales</span>
            </b-col>
            <b-col md="3" class="text-right">
                <router-link to="/atoms/atom-drill-down">
                    <b-button
                            variant="outline-primary"
                            title="Registro Anterior"
                    >
                        <feather-icon icon="ArrowLeftIcon"/>
                        <span>Regresar</span>
                    </b-button>
                </router-link>
            </b-col>
        </b-row>
        <hr>
        <b-row>
            <b-col>
                <h4 class="text-primary">Cargar Átomo</h4>

            </b-col>
        </b-row>
        <b-row class="m-5">
            <b-col>
                <b-form-file
                        placeholder="Escoja un archivo y carguelo aquí..."
                        drop-placeholder="Arrástelo Aquí..."
                        multiple
                />
                <b-row>
                    <b-col class="text-right mt-2">
                        <b-button
                                variant="primary"
                                title="Registro Anterior"
                                size="lg"
                        >
                            <feather-icon icon="UploadIcon" size="24"/>
                            <span class="ml-1">Enviar</span>
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

    </b-card-code>
</template>

<script>
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import {
    BTable, BCol, BRow, BButton, BProgress, BMedia, BCardText, BFormFile,
    BButtonGroup,
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
        BTable,
        BCol,
        BRow,
        BButton,
        BProgress,
        BFormFile,
        BCardCode,
        BMedia,
        BButtonGroup,
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
        return {}
    }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
