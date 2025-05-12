<template>
  <LineChartComponent :data="chartData" :options="chartOptions" />
</template>

<script>
import { Line as LineChartComponent } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'LineChart',
  components: { LineChartComponent },
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
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
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
