<template>
  <v-list-item class="px-3">
    <div>
      <div class="d-flex justify-space-between align-center pt-2">
        <v-btn small color="error" @click="clearTimes()" class="my-2">
          Reset
        </v-btn>
        <h4
          class="font-weight-regular pl-4 cursor-pointer"
          @click="ao5Modal = true"
        >
          ao5: <span class="font-weight-bold">{{ averageFive }}</span>
        </h4>
        <v-dialog overlay-opacity="0.2" v-model="ao5Modal" max-width="400px">
          <v-card>
            <v-toolbar color="primary" class="text-h5" dark>
              Average of Five {{ averageFive }}
            </v-toolbar>
            <div class="mx-2 px-2">
              <v-container>
                <div v-for="solve in lastFiveSolves" :key="solve.name">
                  <p class="text-h6 mt-2">
                    Solve {{ solve.name }}:
                    <span class="font-weight-regular">{{ solve.time }}</span>
                  </p>
                  <div></div>
                  <p class="text-h6 mt-n4">
                    Scramble:
                    <span class="font-weight-regular">{{
                      solve && solve.scramble ? solve.scramble.join(" ") : "N/A"
                    }}</span>
                  </p>
                  <v-divider class="mt-n2"></v-divider>
                </div>
              </v-container>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="ao5Modal = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <h4
          class="font-weight-regular pl-1 cursor-pointer"
          @click="ao12Modal = true"
        >
          ao12: <span class="font-weight-bold">{{ averageTwelve }}</span>
        </h4>
        <v-dialog overlay-opacity="0.2" v-model="ao12Modal" max-width="400px">
          <v-card>
            <v-toolbar color="primary" class="text-h5" dark>
              Average of Twelve {{ averageTwelve }}
            </v-toolbar>
            <div class="mx-2 px-2">
              <v-container>
                <div v-for="solve in last12Solves" :key="solve.name">
                  <p class="text-h6 mt-2">
                    Solve {{ solve.name }}:
                    <span class="font-weight-regular">{{ solve.time }}</span>
                  </p>
                  <div></div>
                  <p class="text-h6 mt-n4">
                    Scramble:
                    <span class="font-weight-regular">{{
                      solve && solve.scramble ? solve.scramble.join(" ") : "N/A"
                    }}</span>
                  </p>
                  <v-divider class="mt-n2"></v-divider>
                </div>
              </v-container>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="ao12Modal = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <div class="d-flex justify-space-between align-center pb-2">
        <v-btn
          small
          class="my-2"
          color="primary"
          dark
          @click.stop="addTimeModal = true"
        >
          Add Time
        </v-btn>
        <v-dialog
          overlay-opacity="0.2"
          v-model="addTimeModal"
          max-width="400px"
        >
          <v-card>
            <v-toolbar color="primary" class="text-h5" dark>Add Time</v-toolbar>
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
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="addTimeModal = false">
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
        <h4
          class="font-weight-regular pl-4 cursor-pointer"
          @click="bestTimeModal = true"
        >
          Best:
          <span class="font-weight-bold">{{
            currentBest.time ? convertTime(currentBest.baseTime) : "00.00"
          }}</span>
        </h4>
        <v-dialog
          overlay-opacity="0.2"
          v-model="bestTimeModal"
          max-width="400px"
        >
          <v-card>
            <v-toolbar color="primary" class="text-h5" dark>
              Solve {{ currentBest.name }}
            </v-toolbar>
            <div class="ma-2 pa-2">
              <p class="text-h6">
                Time:
                <span class="font-weight-regular">{{ currentBest.time }}</span>
              </p>
              <p class="text-h6">
                Type:
                <span class="font-weight-regular">{{
                  currentBest.scrambleType
                }}</span>
              </p>
              <p class="text-h6">
                Scramble:
                <span class="font-weight-regular">
                  {{
                    currentBest && currentBest.scramble
                      ? currentBest.scramble.join(" ")
                      : ""
                  }}
                </span>
              </p>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="bestTimeModal = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-list-item>
</template>

<script>
import mean from "lodash.mean";
import takeRight from "lodash.takeright";
import dateFormat from "dateformat";
export default {
  name: "SideNavStats",
  data() {
    return {
      bestTimeModal: false,
      ao5Modal: false,
      ao12Modal: false,
      addedTime: null,
      valid: true,
      addTimeModal: false,
      rules: [
        value => !!value || "Input required",
        value => {
          const pattern = /^(\d+)\.(\d+)$|(^(\d+):(\d+)\.(\d+)$)/;
          return pattern.test(value) || "Invalid format - Ex: 9.30 or 1:20.12";
        }
      ]
    };
  },
  computed: {
    currentSessionTimes() {
      if (this.$store.state.session === 1) {
        return this.$store.state.times;
      } else if (this.$store.state.session === 2) {
        return this.$store.state.timesS2;
      }
      return [];
    },
    lastFiveSolves() {
      return takeRight(this.currentSessionTimes, 5);
    },
    last12Solves() {
      return takeRight(this.currentSessionTimes, 12);
    },
    currentBest() {
      const validTimes = this.currentSessionTimes.filter(time => !time.dnf);
      if (validTimes.length) {
        const times = validTimes.map(time => time.baseTime);
        const index = times.indexOf(Math.min(...times));
        return validTimes[index];
      }
      return {};
    },
    currentMean() {
      const validTimes = this.currentSessionTimes.filter(time => !time.dnf);
      if (validTimes.length) {
        const times = validTimes.map(time => time.baseTime);
        return this.convertTime(mean(times));
      }
      return "00.00";
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
      return "00.00";
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
      return "00.00";
    }
  },
  methods: {
    convertTime(time) {
      const format = time > 60000 ? "M:ss.L" : "ss.L";
      const date = new Date(time);
      return dateFormat(date, format);
    },
    convertDateToTime(date) {
      const t = date
        .split(":")
        .join(",")
        .split(".")
        .join(",")
        .split(",");
      return t.length >= 3
        ? +t[0] * 60000 + +t[1] * 1000 + +t[2] * 10
        : +t[0] * 1000 + +t[1] * 10;
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
        this.addTimeModal = false;
      }
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
