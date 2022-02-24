<template>
  <v-list-item class="d-flex align-center px-3 pb-2">
    <v-btn
      small
      aria-label="settings"
      @click.stop="settings = true"
      class="mt-2 button-min-width"
      color="blue-grey lighten-2"
      dark
    >
      <v-icon small>{{ settingsIcon }}</v-icon>
    </v-btn>
    <v-dialog overlay-opacity="0.2" v-model="settings" max-width="400px">
      <v-card>
        <v-toolbar color="primary" class="text-h5" dark>Settings</v-toolbar>
        <p class="text-h6 mt-3 mb-0 ml-4">General</p>
        <v-card-text>
          <div class="d-flex justify-space-between mt-0">
            <div>
              <v-checkbox
                v-model="sortDesc"
                label="Sort descending"
              ></v-checkbox>
              <v-checkbox
                class="mt-0"
                v-model="hideAll"
                label="Hide all during solve"
              ></v-checkbox>
              <v-checkbox
                class="mt-0"
                v-model="clickStart"
                label="Click/touch to start"
              ></v-checkbox>
              <v-checkbox
                class="mt-0"
                v-model="inspectionTime"
                label="Inspection time"
              ></v-checkbox>
            </div>
            <div>
              <v-switch v-model="darkMode" inset label="Dark mode"></v-switch>
              <v-btn
                aria-label="export"
                small
                @click.stop="exportTimes"
                color="primary"
                dark
              >
                Export
                <v-icon class="export-icon" small>{{ downloadIcon }}</v-icon>
              </v-btn>
            </div>
          </div>
          <v-slider
            v-model="timerSize"
            class="pt-4 mb-n3"
            min="5"
            max="20"
            label="Timer Size"
            thumb-size="24"
            thumb-color="primary"
            thumb-label="always"
          ></v-slider>
        </v-card-text>
        <p class="text-h6 ml-4">Chart Options</p>
        <v-card-text>
          <div class="d-flex justify-space-between mb-2">
            <v-checkbox
              class="mt-0"
              v-model="removeChart"
              label="Hide chart"
            ></v-checkbox>
            <v-btn
              aria-label="default"
              small
              @click.stop="resetDefault"
              class="mr-2"
              color="primary"
              dark
            >
              Reset Default
            </v-btn>
          </div>
          <v-slider
            v-model="chartWidth"
            class="pt-4"
            min="300"
            max="900"
            label="Width"
            thumb-size="24"
            thumb-color="primary"
            thumb-label="always"
          ></v-slider>
          <v-slider
            v-model="chartHeight"
            class="pt-4"
            min="200"
            max="500"
            label="Height"
            thumb-size="24"
            thumb-color="primary"
            thumb-label="always"
          ></v-slider>
          <p class="footer-text mb-0 mt-3">
            Created by Kevin Tian, please report any bugs/issues
            <a href="https://github.com/kt474/ktimer/issues" target="_blank"
              >here</a
            >
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="close"
            color="primary darken-1"
            text
            @click="settings = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      small
      aria-label="theme"
      @click.stop="themeSettings = true"
      class="mt-2 button-min-width theme-button"
      color="blue-grey lighten-2"
      dark
    >
      <v-icon small>{{ paletteIcon }}</v-icon>
    </v-btn>
    <v-dialog overlay-opacity="0.2" v-model="themeSettings" max-width="400px">
      <v-card>
        <v-toolbar color="primary" class="text-h5" dark>Theme</v-toolbar>
        <p class="text-h6 mt-3 mb-0 ml-4"></p>
        <v-card-text>
          <v-radio-group v-model="themeColor" column>
            <div class="d-flex justify-space-around mt-2">
              <div>
                <v-radio label="Blue" color="#1976D2" value="#1976D2"></v-radio>
                <v-radio label="Red" color="#E53935" value="#E53935"></v-radio>
                <v-radio
                  label="Green"
                  color="#43A047"
                  value="#43A047"
                ></v-radio>
                <v-radio
                  label="Purple"
                  color="#8E24AA"
                  value="#8E24AA"
                ></v-radio>
              </div>
              <div>
                <v-radio label="Pink" color="#D81B60" value="#D81B60"></v-radio>
                <v-radio
                  label="Orange"
                  color="#F57C00"
                  value="#F57C00"
                ></v-radio>
                <v-radio
                  label="Yellow"
                  color="#F9A825"
                  value="#F9A825"
                ></v-radio>
                <v-radio label="Black" color="#000" value="#000"></v-radio>
              </div>
            </div>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="close"
            color="primary darken-1"
            text
            @click="themeSettings = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h3 class="mt-2 mx-auto">Solves: {{ solves }}</h3>
  </v-list-item>
</template>

<script>
import { mdiPalette, mdiDownload, mdiCog } from "@mdi/js";
export default {
  name: "SideNavSettings",
  data() {
    return {
      chartWidth: 675,
      chartHeight: 275,
      timerSize: this.$vuetify.breakpoint.smAndDown ? 8 : 14,
      darkMode: this.$vuetify.theme.dark,
      paletteIcon: mdiPalette,
      downloadIcon: mdiDownload,
      settingsIcon: mdiCog,
      sortDesc: true,
      hideAll: false,
      inspectionTime: false,
      removeChart: this.$vuetify.breakpoint.mdAndDown,
      clickStart: this.$vuetify.breakpoint.mdAndDown,
      settings: false,
      themeSettings: false,
      themeColor: "#1976D2"
    };
  },
  computed: {
    currentTimes() {
      const times = this.currentSessionTimes;
      times.forEach((item, index) => {
        item["name"] = index + 1;
      });
      return times;
    },
    currentSessionTimes() {
      if (this.$store.state.session === 1) {
        return this.$store.state.times;
      } else if (this.$store.state.session === 2) {
        return this.$store.state.timesS2;
      }
      return [];
    },
    solves() {
      return this.currentSessionTimes.length;
    }
  },
  methods: {
    updateTheme(color) {
      this.$vuetify.theme.themes.light.primary = color;
      this.$vuetify.theme.themes.dark.primary = color;
    },
    resetDefault() {
      this.chartWidth = 675;
      this.chartHeight = 275;
    },
    exportTimes() {
      let result = [];
      this.currentSessionTimes.forEach((solve, index) => {
        let scramble = solve.scramble ? solve.scramble.join(" ") : "";
        result.push([index + 1, solve.time, scramble]);
      });
      let csv = "Solve,Time,Scramble\n";
      result.forEach(row => {
        csv += row.join(",");
        csv += "\n";
      });
      const anchor = document.createElement("a");
      anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      anchor.target = "_blank";
      anchor.download = "timer_solves.csv";
      anchor.click();
    },
    loadLocalStorage() {
      this.$store.commit("updateClickStart", this.clickStart);
      this.$store.commit("updateRemoveChart", this.removeChart);
      this.$store.commit("updateTimerSize", this.timerSize);
      if (localStorage.inspectionTime) {
        this.inspectionTime = JSON.parse(localStorage.inspectionTime);
      }
      if (localStorage.themeColor) {
        this.themeColor = localStorage.themeColor;
      }
      if (localStorage.timerSize) {
        this.timerSize = JSON.parse(localStorage.timerSize);
      }
      if (localStorage.chartWidth) {
        this.chartWidth = JSON.parse(localStorage.chartWidth);
      }
      if (localStorage.chartHeight) {
        this.chartHeight = JSON.parse(localStorage.chartHeight);
      }
      if (localStorage.clickStart) {
        this.clickStart = JSON.parse(localStorage.clickStart);
      }
      if (localStorage.darkMode) {
        this.darkMode = JSON.parse(localStorage.darkMode);
      }
      if (localStorage.sortDesc) {
        this.sortDesc = JSON.parse(localStorage.sortDesc);
      }
      if (localStorage.hideAll) {
        this.hideAll = JSON.parse(localStorage.hideAll);
      }
      if (localStorage.removeChart) {
        this.removeChart = JSON.parse(localStorage.removeChart);
      }
      if (localStorage.getItem("solves")) {
        try {
          const solves = JSON.parse(localStorage.getItem("solves"));
          solves.forEach(solve => {
            this.$store.commit("addTime", solve);
          });
        } catch (e) {
          localStorage.removeItem("solves");
        }
      }
      if (localStorage.getItem("solves2")) {
        try {
          const solves = JSON.parse(localStorage.getItem("solves2"));
          solves.forEach(solve => {
            this.$store.commit("addTime", solve);
          });
        } catch (e) {
          localStorage.removeItem("solves2");
        }
      }
    }
  },
  mounted() {
    this.loadLocalStorage();
  },
  watch: {
    inspectionTime() {
      localStorage.inspectionTime = this.inspectionTime;
      this.$store.commit("updateInspectionTime", this.inspectionTime);
    },
    themeColor() {
      this.updateTheme(this.themeColor);
      localStorage.themeColor = this.themeColor;
    },
    timerSize() {
      localStorage.timerSize = this.timerSize;
      this.$store.commit("updateTimerSize", this.timerSize);
    },
    chartWidth() {
      localStorage.chartWidth = this.chartWidth;
      this.$store.commit("updateChartWidth", this.chartWidth);
    },
    chartHeight() {
      localStorage.chartHeight = this.chartHeight;
      this.$store.commit("updateChartHeight", this.chartHeight);
    },
    clickStart() {
      localStorage.clickStart = this.clickStart;
      this.$store.commit("updateClickStart", this.clickStart);
    },
    darkMode() {
      this.$vuetify.theme.dark = this.darkMode;
      localStorage.darkMode = this.darkMode;
    },
    sortDesc() {
      localStorage.sortDesc = this.sortDesc;
      this.$emit("sortDesc", this.sortDesc);
    },
    hideAll() {
      localStorage.hideAll = this.hideAll;
      this.$store.commit("updateHideAll", this.hideAll);
    },
    removeChart() {
      localStorage.removeChart = this.removeChart;
      this.$store.commit("updateRemoveChart", this.removeChart);
    },
    currentSessionTimes: {
      handler: function() {
        const parsed = JSON.stringify(this.currentTimes);
        if (this.$store.state.session === 1) {
          localStorage.setItem("solves", parsed);
        } else if (this.$store.state.session === 2) {
          localStorage.setItem("solves2", parsed);
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.theme-button {
  margin-left: 6px;
}
.button-min-width {
  min-width: 0 !important;
}
.export-icon {
  margin-top: 2px;
  margin-left: 4px;
}
.footer-text {
  font-size: 0.75rem;
}
</style>
