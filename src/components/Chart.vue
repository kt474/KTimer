<template>
  <apexchart
    v-if="!noChart"
    class="d-flex justify-center align-center"
    :class="{ 'apex-chart': hideChartDuringSolve }"
    type="line"
    height="40%"
    width="55%"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  name: "Chart",
  components: {
    apexchart: VueApexCharts
  },
  computed: {
    solveTimes() {
      return this.$store.state.session === 1
        ? this.$store.state.times
        : this.$store.state.timesS2;
    },
    noChart() {
      return this.$store.state.removeChart;
    },
    hideChartDuringSolve() {
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
    }
  },
  methods: {
    updateLegendColors() {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          chart: {
            foreColor: this.textColor,
            type: "line",
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          tooltip: {
            theme: this.darkMode
          }
        }
      };
    },
    updateChart() {
      const session = this.$store.state.session;
      const times =
        session === 1 ? this.$store.state.times : this.$store.state.timesS2;
      const timesArray = times.map(solve => solve.baseTime / 1000);
      const maxValue =
        timesArray.length > 0 ? Math.ceil(Math.max(...timesArray) + 1) : 10;
      this.series = [
        {
          name: "Time",
          data: times.map(solve => solve.baseTime / 1000)
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
    },
    forceResize() {
      //force apex chart to resize on mount
      this.$store.commit("addTime", {
        name: 1000,
        baseTime: null,
        time: null,
        remove: null,
        plusTwo: false,
        dnf: false,
        session: this.$store.state.session,
        scramble: null
      });
      this.$store.commit("removeTime", {
        session: this.$store.state.session,
        index: 1000
      });
    }
  },
  mounted() {
    this.forceResize();
  },
  watch: {
    solveTimes: {
      handler: function() {
        this.updateChart();
      },
      immediate: true
    },
    darkMode: {
      handler: function() {
        this.updateLegendColors();
      },
      immediate: true
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
          },
          toolbar: {
            show: false
          }
        },
        colors: ["#1976d2"],
        markers: {
          size: 5
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
.apex-chart {
  display: none !important;
}
</style>
