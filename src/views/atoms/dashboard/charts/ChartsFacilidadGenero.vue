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
              <span>Género</span>
              <vue-apex-charts type="bar" :width=chartOptionsGenero.chart.width :options="chartOptionsGenero" :series="dataGenero.series"></vue-apex-charts>
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
      dataGenero: {
        series: [{
          name: 'Hombres',
          data: [25652, 8619, 19, 11]
        }, {
          name: 'Mujeres',
          data: [18275, 7818, 7, 3]
        }],
      },
      chartOptionsGenero: {
        chart: {
          type: 'bar',
          width: '800px',
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
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        xaxis: {
          type: 'category',
          categories: ['Préstamo', 'Tarjeta de Crédito', 'Sobregiro Ocasional', 'Sobregiro Contractual'],
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
                fontSize: '10px',
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
