<template>
  <apexchart
    class="d-flex justify-center align-center"
    :class="{ 'apex-chart': hideChart }"
    type="line"
    height="300"
    width="700"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  name: "Chart",
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    solveTimes() {
      return this.$store.state.session === 1
        ? this.$store.state.times
        : this.$store.state.timesS2;
    },
    hideChart() {
      if (this.$store.state.isSolving && this.$store.state.hideAll) {
        return true;
      }
      return false;
    },
  },
  methods: {
    updateChart() {
      const session = this.$store.state.session;
      const times =
        session === 1 ? this.$store.state.times : this.$store.state.timesS2;
      const timesArray = times.map((solve) => solve.baseTime / 1000);
      const maxValue =
        timesArray.length > 0 ? Math.round(Math.max(...timesArray)) + 1 : 10;
      this.series = [
        {
          name: "Time",
          data: times.map((solve) => solve.baseTime / 1000),
        },
      ];
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          yaxis: {
            min: 0,
            max: maxValue,
            decimalsInFloat: 2,
          },
        },
      };
    },
  },
  watch: {
    solveTimes: {
      handler: function() {
        this.updateChart();
      },
      immediate: true,
    },
  },
  data: () => {
    return {
      series: [
        {
          name: "Time",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Solve Times",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        yaxis: [
          {
            min: 0,
            max: 10,
            decimalsInFloat: 2,
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
.apex-chart {
  display: none !important;
}
</style>
