<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    }

    return { chartOptions }
  },
}
</script>
