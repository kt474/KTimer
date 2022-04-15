<template>
  <apex-chart
    v-if="!noChart"
    class="chart"
    type="line"
    :width="chartWidth"
    :height="chartHeight"
    :options="chartOptions"
    :series="series"
  ></apex-chart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Chart",
  components: {
    apexChart: VueApexCharts
  },
  computed: {
    themeColor() {
      return this.$vuetify.theme.themes.light.primary;
    },
    chartWidth() {
      return this.$store.state.chartWidth;
    },
    chartHeight() {
      return this.$store.state.chartHeight;
    },
    solveTimes() {
      return this.$store.state["times" + this.$store.state.session];
    },
    noChart() {
      return this.$store.state.removeChart;
    },
    hideChartDuringSolve() {
      return this.$store.state.isSolving && this.$store.state.hideAll;
    },
    darkMode() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    textColor() {
      return this.darkMode === "dark" ? "#fff" : "#000";
    }
  },
  methods: {
    updateChartColors(color) {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          colors: [color]
        }
      };
    },
    updateLegendColors() {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          chart: {
            foreColor: this.textColor,
            type: "line",
            zoom: {
              enabled: false
            }
          },
          tooltip: {
            theme: this.darkMode
          }
        }
      };
    },
    updateChart() {
      const times = this.solveTimes;
      const timesArray = times.map((solve) => solve.baseTime / 1000);
      timesArray.forEach((val, index) => {
        if (isNaN(val)) {
          timesArray[index] = 0;
        }
      });
      const maxValue =
        timesArray.length > 0 ? Math.ceil(Math.max(...timesArray) + 1) : 10;
      this.series = [
        {
          name: "Time",
          data: timesArray
        }
      ];
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          yaxis: {
            min: 0,
            max: maxValue,
            decimalsInFloat: 2,
            tickAmount: 4
          }
        }
      };
    }
  },
  mounted() {
    this.updateLegendColors();
  },
  watch: {
    themeColor: {
      handler: function () {
        this.updateChartColors(this.themeColor);
      },
      immediate: true
    },
    solveTimes: {
      handler: function () {
        this.updateChart();
      },
      deep: true,
      immediate: true
    },
    darkMode() {
      this.updateLegendColors();
    }
  },
  data: () => {
    return {
      series: [
        {
          name: "Time",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          foreColor: "#000",
          type: "line",
          zoom: {
            enabled: false
          }
        },
        colors: ["#1976d2"],
        markers: {
          size: 4,
          strokeWidth: 1
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Solve Times",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        yaxis: [
          {
            min: 0,
            max: 10,
            decimalsInFloat: 2,
            tickAmount: 4
          }
        ],
        tooltip: {
          theme: "light"
        }
      }
    };
  }
};
</script>

<style scoped>
.chart {
  color: #000 !important;
}
</style>
