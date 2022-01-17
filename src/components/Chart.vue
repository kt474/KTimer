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
    darkMode() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    textColor() {
      return this.darkMode === "dark" ? "#fff" : "#000";
    },
  },
  methods: {
    updateLegendColors() {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          chart: {
            height: 300,
            foreColor: this.textColor,
            type: "line",
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          tooltip: {
            theme: this.darkMode,
          },
        },
      };
    },
    updateChart() {
      const session = this.$store.state.session;
      const times =
        session === 1 ? this.$store.state.times : this.$store.state.timesS2;
      const timesArray = times.map((solve) => solve.baseTime / 1000);
      const maxValue =
        timesArray.length > 0 ? Math.ceil(Math.max(...timesArray)) : 10;
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
            tickAmount: 4,
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
    darkMode: {
      handler: function() {
        this.updateLegendColors();
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
          height: 300,
          foreColor: "#000",
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        markers: {
          size: 5,
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
            tickAmount: 4,
          },
        ],
        tooltip: {
          theme: "light",
        },
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
