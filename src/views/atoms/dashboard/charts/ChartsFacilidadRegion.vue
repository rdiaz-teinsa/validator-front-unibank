<template>
  <b-row>
    <b-col md="12">
      <b-card>
        <b-card-header>
          <b-card-title>Facilidad</b-card-title>
        </b-card-header>
        <b-card-body>
          <b-row>
            <b-col md="6" class="p-4">
              <span>Región</span>
              <vue-apex-charts type="bar" height="250px" :width=chartOptionsRegion.chart.width :options="chartOptionsRegion" :series="dataRegion.series"></vue-apex-charts>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BRow, BCol, BMedia, BMediaAside, BAvatar, BMediaBody,
} from 'bootstrap-vue'
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    VueApexCharts,
  },
  data() {
    return {
      dataRegion: {
        series: [{
          name: 'Préstamo',
          data: [1140,
            673,
            581,
            3527,
            36,
            913,
            534,
            35544,
            219,
            62,
            1843,
            1,
            1,
            0,
            0,
            0]
        },
          {
          name: 'Tarjeta de Crédito',
          data: [0,
            0,
            0,
            0,
            0,
            0,
            0,
            16933,
            0,
            203,
            0,
            0,
            0,
            0,
            0]
        },
          {
          name: 'Financiamiento Ctas x Cobrar',
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            545,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0]
        },{
          name: 'Sobregiro Ocasional',
          data: [
            0,
            2,
            0,
            6,
            0,
            0,
            0,
            87,
            0,
            5,
            1,
            0,
            0,
            1,
            0,
            0]
        },{
          name: 'Sobregiro Contractual',
          data: [
            1,
            0,
            0,
            4,
            0,
            0,
            0,
            34,
            0,
            3,
            0,
            0,
            0,
            0,
            1,
            1]
        }, ],
      },
      chartOptionsRegion: {
        chart: {
          type: 'bar',
          width: '1180px',
          stacked: true,
          stackType: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            height: '150px',
            barHeight: '70%',

            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            },
          },
        },
        xaxis: {
          type: 'category',
          categories: ['BOCAS DEL TORO',
            'COCLE',
            'COLON',
            'CHIRIQUI',
            'DARIEN',
            'HERRERA',
            'LOS SANTOS',
            'PANAMA',
            'VERAGUAS',
            'ZONA LIBRE (COLON)',
            'PANAMA OESTE',
            'BRAZIL',
            'PANAMA',
            'VENEZUELA',
            'HONG KONG',
            'ISRAEL',                                                                                               ],
          tickAmount: undefined,
          tickPlacement: 'between',
          min: undefined,
          max: undefined,
          stepSize: undefined,
          range: undefined,
          floating: false,
          decimalsInFloat: undefined,
          overwriteCategories: undefined,
          position: 'right',
          labels: {
          show: true,
              rotate: 0,
              rotateAlways: false,
              hideOverlappingLabels: true,
              showDuplicates: false,
              trim: false,
              minHeight: undefined,
              maxHeight: 120,
              style: {
            colors: [],
                fontSize: '6px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
          },
        offsetX: 0,
            offsetY: 0,
            format: undefined,
            formatter: undefined,
            datetimeUTC: true,
            datetimeFormatter: {
          year: 'yyyy',
              month: "MMM 'yy",
              day: 'dd MMM',
              hour: 'HH:mm',
        },
      },
      axisTicks: {
        show: true,
            borderType: 'solid',
            color: '#78909C',
            height: 6,
            offsetX: 0,
            offsetY: 0
      },
      title: {
        text: undefined,
            offsetX: 0,
            offsetY: 0,
            style: {
          color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
        },
      },
      tooltip: {
        enabled: true,
            formatter: undefined,
            offsetY: 0,
            style: {
          fontSize: 0,
              fontFamily: 0,
        },
      },
    },
        legend: {
          position: 'right',
          offsetX: 0,
          offsetY: 50
        },
        fill: {
          opacity: 1
        },
    },

    }
  }



}
</script>
<style>
</style>
