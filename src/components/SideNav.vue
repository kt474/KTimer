<template>
  <v-card width="340" class="mx-auto card">
    <v-list-item class="px-3">
      <div>
        <v-list-item-title class="d-flex align-middle pt-2">
          <img
            alt="logo"
            width="24"
            height="24"
            src="../assets/logo.svg"
            class="mt-1 mr-2"
          />
          <p class="text-h6">KTimer</p>
        </v-list-item-title>
        <div class="d-flex mt-1">
          <label for="session" class="text--secondary pr-3">
            Session
          </label>
          <v-select
            id="session"
            v-if="showSelect"
            dense
            height="20"
            v-model="session"
            :items="items"
            @change="changeSelect"
            class="mt-0 session-select"
          ></v-select>
        </div>
      </div>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item class="px-3">
      <div>
        <div class="d-flex justify-space-between align-center pt-2">
          <v-btn
            depressed
            small
            color="error"
            @click="clearTimes()"
            class="my-2"
          >
            Reset
          </v-btn>
          <h4 class="font-weight-regular pl-4">
            ao5: <span class="font-weight-bold">{{ averageFive }}</span>
          </h4>
          <h4 class="font-weight-regular pl-1">
            ao12: <span class="font-weight-bold">{{ averageTwelve }}</span>
          </h4>
        </div>
        <div class="d-flex justify-space-between align-center pb-2">
          <v-btn
            small
            depressed
            class="my-2"
            color="primary"
            dark
            @click.stop="dialog = true"
          >
            Add Time
          </v-btn>
          <v-dialog overlay-opacity="0.2" v-model="dialog" max-width="400px">
            <v-card>
              <v-toolbar color="primary" class="text-h5" dark
                >Add Time</v-toolbar
              >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field
                          label="Time"
                          v-model="addedTime"
                          :rules="rules"
                          hide-details="auto"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  :disabled="!valid"
                  color="blue darken-1"
                  text
                  @click="addTime()"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <h4 class="font-weight-regular pl-4">
            Mean: <span class="font-weight-bold">{{ currentMean }}</span>
          </h4>
          <h4 class="font-weight-regular pl-4">
            Best: <span class="font-weight-bold">{{ currentBest }}</span>
          </h4>
        </div>
      </div>
    </v-list-item>
    <v-divider></v-divider>
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
                  label="Click to start"
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
                  <v-radio
                    label="Blue"
                    color="#1976D2"
                    value="#1976D2"
                  ></v-radio>
                  <v-radio
                    label="Red"
                    color="#E53935"
                    value="#E53935"
                  ></v-radio>
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
                  <v-radio
                    label="Pink"
                    color="#D81B60"
                    value="#D81B60"
                  ></v-radio>
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
    <v-divider></v-divider>
    <sideNavTable :sort-desc="sortDesc" />
    <v-divider></v-divider>
  </v-card>
</template>
<script>
import sideNavTable from "@/components/SideNavTable";
import dateFormat from "dateformat";
import mean from "lodash.mean";
import { mdiPalette, mdiDownload, mdiCog } from "@mdi/js";
export default {
  name: "SideNav",
  components: {
    sideNavTable
  },
  data() {
    return {
      paletteIcon: mdiPalette,
      downloadIcon: mdiDownload,
      settingsIcon: mdiCog,
      showSelect: true,
      timerSize: this.$vuetify.breakpoint.smAndDown ? 8 : 14,
      chartWidth: 675,
      chartHeight: 275,
      darkMode: this.$vuetify.theme.dark,
      session: 1,
      sortDesc: true,
      hideAll: false,
      removeChart: this.$vuetify.breakpoint.mdAndDown,
      clickStart: this.$vuetify.breakpoint.mdAndDown,
      items: [1, 2],
      valid: true,
      rules: [
        value => !!value || "Input required",
        value => {
          const pattern = /^(\d+):(\d+)$|(^(\d+):(\d+):(\d+)$)/;
          return pattern.test(value) || "Invalid format - Ex: 9:30 or 1:20:12";
        }
      ],
      addedTime: null,
      dialog: false,
      settings: false,
      themeSettings: false,
      themeColor: "#1976D2"
    };
  },
  computed: {
    solves() {
      return this.currentSessionTimes.length;
    },
    currentSessionTimes() {
      if (this.$store.state.session === 1) {
        return this.$store.state.times;
      } else if (this.$store.state.session === 2) {
        return this.$store.state.timesS2;
      }
      return [];
    },
    currentBest() {
      const validTimes = this.currentSessionTimes.filter(time => !time.dnf);
      if (validTimes.length) {
        const times = validTimes.map(time => time.baseTime);
        return this.convertTime(Math.min(...times));
      }
      return "00:00";
    },
    currentMean() {
      const validTimes = this.currentSessionTimes.filter(time => !time.dnf);
      if (validTimes.length) {
        const times = validTimes.map(time => time.baseTime);
        return this.convertTime(mean(times));
      }
      return "00:00";
    },
    currentTimes() {
      const times = this.currentSessionTimes;
      times.forEach((item, index) => {
        item["name"] = index + 1;
      });
      return times;
    },
    averageFive() {
      const currentLength = this.currentSessionTimes.length;
      if (currentLength >= 5) {
        let temp = this.currentSessionTimes.map(time => time.baseTime);
        temp = temp.slice(currentLength - 5, currentLength + 1);
        const dnfCount = temp.filter(time => time === "DNF").length;
        if (dnfCount >= 2) {
          return "DNF";
        }
        if (dnfCount === 1) {
          temp = temp.filter(item => item !== "DNF");
          temp.push("filler");
        }
        temp.sort((a, b) => a - b);
        temp.shift();
        temp.pop();
        return this.convertTime(mean(temp));
      }
      return "00:00";
    },
    averageTwelve() {
      const currentLength = this.currentSessionTimes.length;
      if (currentLength >= 12) {
        let temp = this.currentSessionTimes.map(time => time.baseTime);
        temp = temp.slice(currentLength - 12, currentLength + 1);
        const dnfCount = temp.filter(time => time === "DNF").length;
        if (dnfCount >= 2) {
          return "DNF";
        }
        if (dnfCount === 1) {
          temp = temp.filter(item => item !== "DNF");
          temp.push("filler");
        }
        temp.sort((a, b) => a - b);
        temp.shift();
        temp.pop();
        return this.convertTime(mean(temp));
      }
      return "00:00";
    }
  },
  mounted() {
    this.loadLocalStorage();
  },
  watch: {
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
    },
    hideAll() {
      localStorage.hideAll = this.hideAll;
      this.$store.commit("updateHideAll", this.hideAll);
    },
    removeChart() {
      localStorage.removeChart = this.removeChart;
      this.$store.commit("updateRemoveChart", this.removeChart);
    },
    session() {
      localStorage.session = this.session;
      this.$store.commit("updateSession", this.session);
    },
    currentSessionTimes() {
      const parsed = JSON.stringify(this.currentTimes);
      if (this.$store.state.session === 1) {
        localStorage.setItem("solves", parsed);
      } else if (this.$store.state.session === 2) {
        localStorage.setItem("solves2", parsed);
      }
    }
  },
  methods: {
    updateTheme(color) {
      this.$vuetify.theme.themes.light.primary = color;
      this.$vuetify.theme.themes.dark.primary = color;
    },
    changeSelect() {
      this.showSelect = false;
      this.$nextTick(() => {
        this.showSelect = true;
      });
    },
    loadLocalStorage() {
      this.$store.commit("updateClickStart", this.clickStart);
      this.$store.commit("updateRemoveChart", this.removeChart);
      this.$store.commit("updateTimerSize", this.timerSize);
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
      if (localStorage.session) {
        this.session = JSON.parse(localStorage.session);
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
    clearTimes() {
      this.$store.commit("clearTimes", this.$store.state.session);
    },
    addTime() {
      if (this.$refs.form.validate()) {
        this.$store.commit("addTime", {
          baseTime: this.convertDateToTime(this.addedTime),
          time: this.addedTime,
          remove: null,
          plusTwo: false,
          dnf: false,
          session: this.$store.state.session,
          scramble: null,
          scrambleType: null
        });
        this.dialog = false;
      }
    },
    convertDateToTime(date) {
      const t = date.split(":");
      return t.length >= 3
        ? +t[0] * 60000 + +t[1] * 1000 + +t[2] * 10
        : +t[0] * 1000 + +t[1] * 10;
    },
    convertTime(time) {
      const format = time > 60000 ? "M:ss:L" : "ss:L";
      const date = new Date(time);
      return dateFormat(date, format);
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
.card {
  height: 100%;
  overflow: hidden !important;
  box-shadow: none !important;
}
.session-select {
  width: 4rem;
}
</style>
