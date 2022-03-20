<template>
  <div class="px-3">
    <div class="d-flex justify-space-between align-center">
      <div class="buttons">
        <v-dialog
          overlay-opacity="0.2"
          v-model="resetTimes"
          max-width="400px"
          @keydown.enter="clearTimes"
        >
          <v-card>
            <v-toolbar color="primary" class="text-h5" dark>
              Reset all times?
            </v-toolbar>
            <div class="mx-2 px-2">
              <v-container> </v-container>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary darken-1" text @click="resetTimes = false">
                Cancel
              </v-btn>
              <v-btn color="primary darken-1" text @click="clearTimes">
                Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn small color="error" @click="resetTimes = true" class="my-2">
          Reset
        </v-btn>
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
          @keydown.enter="addTime"
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
              <v-btn
                color="primary darken-1"
                text
                @click="addTimeModal = false"
              >
                Close
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="primary darken-1"
                text
                @click="addTime()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-0 py-0 text-center">
            <v-container>
              <v-row>
                <v-col class="ao5 py-2">
                  <h4
                    class="font-weight-regular stat-width"
                    @click.stop="ao5Modal = true"
                  >
                    Ao5
                    <span class="font-weight-bold">{{ averageFive }}</span>
                  </h4>
                  <v-dialog
                    overlay-opacity="0.2"
                    v-model="ao5Modal"
                    max-width="400px"
                  >
                    <v-card>
                      <v-toolbar color="primary" class="text-h5" dark>
                        Average of 5: {{ averageFive }}
                      </v-toolbar>
                      <div class="mx-2 px-2">
                        <v-container>
                          <div
                            v-for="solve in lastFiveSolves"
                            :key="solve.name"
                          >
                            <p class="text-h6 mt-2">
                              Solve {{ solve.name }}:
                              <span class="font-weight-regular">{{
                                solve.time
                              }}</span>
                            </p>
                            <div></div>
                            <p class="text-h6">
                              Scramble:
                              <span class="font-weight-regular">{{
                                solve && solve.scramble
                                  ? solve.scramble.join(" ")
                                  : "N/A"
                              }}</span>
                            </p>
                            <v-divider class="mt-n2"></v-divider>
                          </div>
                        </v-container>
                      </div>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary darken-1"
                          text
                          @click="ao5Modal = false"
                        >
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
                <v-col class="ao12 py-2">
                  <h4
                    class="font-weight-regular stat-width"
                    @click.stop="ao12Modal = true"
                  >
                    Ao12
                    <span class="font-weight-bold">{{ averageTwelve }}</span>
                  </h4>
                  <v-dialog
                    overlay-opacity="0.2"
                    v-model="ao12Modal"
                    max-width="400px"
                  >
                    <v-card>
                      <v-toolbar color="primary" class="text-h5" dark>
                        Average of 12: {{ averageTwelve }}
                      </v-toolbar>
                      <div class="mx-2 px-2">
                        <v-container>
                          <div v-for="solve in last12Solves" :key="solve.name">
                            <p class="text-h6 mt-2">
                              Solve {{ solve.name }}:
                              <span class="font-weight-regular">{{
                                solve.time
                              }}</span>
                            </p>
                            <div></div>
                            <p class="text-h6">
                              Scramble:
                              <span class="font-weight-regular">{{
                                solve && solve.scramble
                                  ? solve.scramble.join(" ")
                                  : "N/A"
                              }}</span>
                            </p>
                            <v-divider class="mt-n2"></v-divider>
                          </div>
                        </v-container>
                      </div>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary darken-1"
                          text
                          @click="ao12Modal = false"
                        >
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-divider class="mb-n1 mt-2 ml-n1"></v-divider>
              <v-row class="mt-1">
                <v-col class="mean py-2">
                  <h4
                    class="font-weight-regular cursor-default stat-width"
                    @click.stop=""
                  >
                    Mean
                    <span class="font-weight-bold">{{ currentMean }}</span>
                  </h4>
                </v-col>
                <v-col class="best py-2">
                  <h4
                    class="font-weight-regular stat-width"
                    @click.stop="bestTimeModal = true"
                  >
                    Best
                    <span class="font-weight-bold">{{
                      currentBest.time
                        ? convertTime(currentBest.baseTime)
                        : "00.00"
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
                          <span class="font-weight-regular">{{
                            currentBest.time
                          }}</span>
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
                        <v-btn
                          color="primary darken-1"
                          text
                          @click="bestTimeModal = false"
                        >
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="text-center">
            <v-divider class="mb-2 mt-0 ml-n4"></v-divider>
            <v-row>
              <v-col class="ao5 py-3 pl-0">
                <h4
                  class="font-weight-regular stat-width cursor-pointer"
                  @click.stop="ao50Modal = true"
                >
                  Ao50
                  <span class="font-weight-bold">{{ averageFifty }}</span>
                </h4>
                <v-dialog
                  overlay-opacity="0.2"
                  v-model="ao50Modal"
                  max-width="400px"
                >
                  <v-card>
                    <v-toolbar color="primary" class="text-h5" dark>
                      Average of 50: {{ averageFifty }}
                    </v-toolbar>
                    <div class="mx-2 px-2">
                      <v-container>
                        <div v-for="solve in lastFiftySolves" :key="solve.name">
                          <p class="text-h6 mt-2">
                            Solve {{ solve.name }}:
                            <span class="font-weight-regular">{{
                              solve.time
                            }}</span>
                          </p>
                          <div></div>
                          <p class="text-h6">
                            Scramble:
                            <span class="font-weight-regular">{{
                              solve && solve.scramble
                                ? solve.scramble.join(" ")
                                : "N/A"
                            }}</span>
                          </p>
                          <v-divider class="mt-n2"></v-divider>
                        </div>
                      </v-container>
                    </div>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary darken-1"
                        text
                        @click="ao50Modal = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col class="ao12 py-3 pl-0">
                <h4
                  class="font-weight-regular stat-width cursor-pointer"
                  @click.stop="ao100Modal = true"
                >
                  Ao100
                  <span class="font-weight-bold">{{ averageHundred }}</span>
                </h4>
                <v-dialog
                  overlay-opacity="0.2"
                  v-model="ao100Modal"
                  max-width="400px"
                >
                  <v-card>
                    <v-toolbar color="primary" class="text-h5" dark>
                      Average of 100: {{ averageHundred }}
                    </v-toolbar>
                    <div class="mx-2 px-2">
                      <v-container>
                        <div
                          v-for="solve in lastHundredSolves"
                          :key="solve.name"
                        >
                          <p class="text-h6 mt-2">
                            Solve {{ solve.name }}:
                            <span class="font-weight-regular">{{
                              solve.time
                            }}</span>
                          </p>
                          <div></div>
                          <p class="text-h6">
                            Scramble:
                            <span class="font-weight-regular">{{
                              solve && solve.scramble
                                ? solve.scramble.join(" ")
                                : "N/A"
                            }}</span>
                          </p>
                          <v-divider class="mt-n2"></v-divider>
                        </div>
                      </v-container>
                    </div>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary darken-1"
                        text
                        @click="ao12Modal = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <v-divider class="mb-2 mt-2 ml-n4"></v-divider>
            <v-row>
              <v-col class="ao5 py-3 pl-0">
                <h4
                  class="font-weight-regular stat-width cursor-pointer"
                  @click.stop="ao500Modal = true"
                >
                  Ao500
                  <span class="font-weight-bold">{{ average500 }}</span>
                </h4>
                <v-dialog
                  overlay-opacity="0.2"
                  v-model="ao500Modal"
                  max-width="400px"
                >
                  <v-card>
                    <v-toolbar color="primary" class="text-h5" dark>
                      Average of 500: {{ average500 }}
                    </v-toolbar>
                    <div class="mx-2 px-2">
                      <v-container>
                        <div v-for="solve in last500Solves" :key="solve.name">
                          <p class="text-h6 mt-2">
                            Solve {{ solve.name }}:
                            <span class="font-weight-regular">{{
                              solve.time
                            }}</span>
                          </p>
                          <div></div>
                          <p class="text-h6">
                            Scramble:
                            <span class="font-weight-regular">{{
                              solve && solve.scramble
                                ? solve.scramble.join(" ")
                                : "N/A"
                            }}</span>
                          </p>
                          <v-divider class="mt-n2"></v-divider>
                        </div>
                      </v-container>
                    </div>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary darken-1"
                        text
                        @click="ao500Modal = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col class="ao12 py-3 pl-0">
                <h4
                  class="font-weight-regular stat-width cursor-pointer"
                  @click.stop="ao1000Modal = true"
                >
                  Ao1000
                  <span class="font-weight-bold">{{ average1000 }}</span>
                </h4>
                <v-dialog
                  overlay-opacity="0.2"
                  v-model="ao1000Modal"
                  max-width="400px"
                >
                  <v-card>
                    <v-toolbar color="primary" class="text-h5" dark>
                      Average of 1000: {{ average1000 }}
                    </v-toolbar>
                    <div class="mx-2 px-2">
                      <v-container>
                        <div v-for="solve in last1000Solves" :key="solve.name">
                          <p class="text-h6 mt-2">
                            Solve {{ solve.name }}:
                            <span class="font-weight-regular">{{
                              solve.time
                            }}</span>
                          </p>
                          <div></div>
                          <p class="text-h6">
                            Scramble:
                            <span class="font-weight-regular">{{
                              solve && solve.scramble
                                ? solve.scramble.join(" ")
                                : "N/A"
                            }}</span>
                          </p>
                          <v-divider class="mt-n2"></v-divider>
                        </div>
                      </v-container>
                    </div>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary darken-1"
                        text
                        @click="ao1000Modal = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
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
      ao50Modal: false,
      ao100Modal: false,
      ao500Modal: false,
      ao1000Modal: false,
      resetTimes: false,
      addedTime: null,
      valid: true,
      addTimeModal: false,
      rules: [
        value => !!value || "Input required",
        value => {
          const pattern = /^(\d+)\.(\d{2,})$|(^(\d+):(\d+)\.(\d{2,})$)/;
          return pattern.test(value) || "Invalid format - Ex: 9.30 or 1:20.12";
        }
      ]
    };
  },
  computed: {
    currentSessionTimes() {
      return this.$store.state["times" + this.$store.state.session];
    },
    last500Solves() {
      return takeRight(this.currentSessionTimes, 500);
    },
    last1000Solves() {
      return takeRight(this.currentSessionTimes, 500);
    },
    lastFiftySolves() {
      return takeRight(this.currentSessionTimes, 50);
    },
    lastHundredSolves() {
      return takeRight(this.currentSessionTimes, 100);
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
      return this.getAverage(5);
    },
    averageTwelve() {
      return this.getAverage(12);
    },
    averageFifty() {
      return this.getAverage(50);
    },
    averageHundred() {
      return this.getAverage(100);
    },
    average500() {
      return this.getAverage(500);
    },
    average1000() {
      return this.getAverage(1000);
    }
  },
  methods: {
    getAverage(numberOfSolves) {
      const currentLength = this.currentSessionTimes.length;
      if (currentLength >= numberOfSolves) {
        let temp = this.currentSessionTimes.map(time => time.baseTime);
        temp = temp.slice(currentLength - numberOfSolves, currentLength + 1);
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
      this.resetTimes = false;
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
.cursor-default {
  cursor: default;
}
.stat-width {
  width: 60px;
  line-height: 1.2rem;
}
</style>
