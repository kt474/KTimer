<template>
  <v-card width="340" class="mx-auto card">
    <v-list-item class="px-3">
      <div>
        <v-list-item-title class="text-h6 pt-4">
          Timer
        </v-list-item-title>
        <div class="d-flex mt-1">
          <p class="text--secondary pr-3">
            Session
          </p>
          <v-select
            dense
            height="20"
            v-model="session"
            :items="items"
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
          <h4 class="font-weight-regular pl-4">ao5: {{ averageFive }}</h4>
          <h4 class="font-weight-regular pl-1">ao12: {{ averageTwelve }}</h4>
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
          <v-dialog v-model="dialog" max-width="400px">
            <v-card>
              <v-toolbar color="primary" class="text-h5" dark
                >Add Time</v-toolbar
              >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Time"
                        v-model="addedTime"
                        :rules="rules"
                        hide-details="auto"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="addTime()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <h4 class="font-weight-regular pl-4">Mean: {{ currentMean }}</h4>
          <h4 class="font-weight-regular pl-4">Best: {{ currentBest }}</h4>
        </div>
      </div>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item class="d-flex align-center px-3 pb-2">
      <v-btn
        small
        @click.stop="settings = true"
        class="mt-2"
        color="blue-grey lighten-2"
        dark
      >
        <v-icon small>mdi-cog</v-icon>
      </v-btn>
      <v-dialog v-model="settings" max-width="400px">
        <v-card>
          <v-toolbar color="primary" class="text-h5" dark>Settings</v-toolbar>
          <v-card-text>
            <v-checkbox v-model="sortDesc" label="Sort descending"></v-checkbox>
            <v-checkbox
              v-model="hideAll"
              label="Hide all during solve"
            ></v-checkbox>
            <p class="footer-text mb-0 mt-3">
              Created by Kevin Tian, please report any bugs/issues
              <a
                href="https://github.com/kt474/rubiks-cube-timer/issues"
                target="_blank"
                >here</a
              >
            </p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="settings = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <h3 class="mt-2 mx-auto">Solves: {{ solves }}</h3>
    </v-list-item>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="currentTimes"
      :items-per-page="50"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hide-default-header
      hide-default-footer
      class="elevation-0 solve-table"
    >
      <template v-slot:[`item.name`]="{ item }">
        <p class="font-weight-bold mb-0 ml-1">{{ item.name }}</p>
      </template>
      <template v-slot:[`item.time`]="{ item }">
        <p class="font-weight-bold mb-0">{{ item.time }}</p>
      </template>
      <template v-slot:[`item.remove`]="{ item }">
        <v-btn
          text
          icon
          @click="removeTime(item.session, item.name)"
          medium
          color="red darken-2"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.plusTwo`]="{ item }">
        <h4
          v-if="currentSessionTimes[item.name - 1].plusTwo"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].plusTwo,
          }"
          class="danger-text"
        >
          +2
        </h4>
        <h4
          v-else
          class="font-weight-regular pointer"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].dnf,
          }"
          @click="plusTwo(item.session, item.name)"
        >
          +2
        </h4>
      </template>
      <template v-slot:[`item.dnf`]="{ item }">
        <h4
          v-if="currentSessionTimes[item.name - 1].dnf"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].dnf,
          }"
          class="danger-text"
        >
          DNF
        </h4>
        <h4
          v-else
          class="font-weight-regular pointer"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].dnf,
          }"
          @click="dnf(item.session, item.name)"
        >
          DNF
        </h4>
      </template>
    </v-data-table>
    <v-divider></v-divider>
  </v-card>
</template>
<script>
import dateFormat from "dateformat";
import { mean } from "lodash";
export default {
  name: "SideNav",
  data() {
    return {
      sortBy: "name",
      sortDesc: null,
      hideAll: null,
      items: [1, 2],
      rules: [
        (value) => !!value || "Input required",
        (value) => (value && value.length >= 3) || "Min 3 characters",
        (value) => (value && value.includes(":")) || "':' required",
      ],
      addedTime: null,
      dialog: false,
      settings: false,
      headers: [
        {
          text: "Times",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "time", value: "time" },
        { text: "plusTwo", value: "plusTwo" },
        { text: "dnf", value: "dnf" },
        { text: "remove", value: "remove" },
      ],
    };
  },
  computed: {
    session: {
      get() {
        return this.$store.state.session;
      },
      set(value) {
        this.$store.commit("updateSession", value);
      },
    },
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
      const validTimes = this.currentSessionTimes.filter((time) => !time.dnf);
      if (validTimes.length) {
        const times = validTimes.map((time) => time.baseTime);
        return this.convertTime(Math.min(...times));
      }
      return "00:00";
    },
    currentMean() {
      const validTimes = this.currentSessionTimes.filter((time) => !time.dnf);
      if (validTimes.length) {
        const times = validTimes.map((time) => time.baseTime);
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
        let temp = this.currentSessionTimes.map((time) => time.baseTime);
        temp = temp.slice(currentLength - 5, currentLength + 1);
        const dnfCount = temp.filter((time) => time == "DNF").length;
        if (dnfCount >= 2) {
          return "DNF";
        }
        if (dnfCount == 1) {
          temp = temp.filter((item) => item !== "DNF");
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
        let temp = this.currentSessionTimes.map((time) => time.baseTime);
        temp = temp.slice(currentLength - 12, currentLength + 1);
        const dnfCount = temp.filter((time) => time == "DNF").length;
        if (dnfCount >= 2) {
          return "DNF";
        }
        if (dnfCount == 1) {
          temp = temp.filter((item) => item !== "DNF");
          temp.push("filler");
        }
        temp.sort((a, b) => a - b);
        temp.shift();
        temp.pop();
        return this.convertTime(mean(temp));
      }
      return "00:00";
    },
  },
  mounted() {
    if (localStorage.sortDesc) {
      this.sortDesc = JSON.parse(localStorage.sortDesc);
    }
    if (localStorage.hideAll) {
      this.hideAll = JSON.parse(localStorage.hideAll);
    }
    if (localStorage.session) {
      this.session = JSON.parse(localStorage.session);
    }
    if (localStorage.getItem("solves")) {
      try {
        const solves = JSON.parse(localStorage.getItem("solves"));
        solves.forEach((solve) => {
          this.$store.commit("addTime", solve);
        });
      } catch (e) {
        localStorage.removeItem("solves");
      }
    }
    if (localStorage.getItem("solves2")) {
      try {
        const solves = JSON.parse(localStorage.getItem("solves2"));
        solves.forEach((solve) => {
          this.$store.commit("addTime", solve);
        });
      } catch (e) {
        localStorage.removeItem("solves2");
      }
    }
  },
  watch: {
    sortDesc() {
      localStorage.sortDesc = this.sortDesc;
    },
    hideAll() {
      localStorage.hideAll = this.hideAll;
      this.$store.commit("updateHideAll", this.hideAll);
    },
    session() {
      localStorage.session = this.session;
    },
    currentSessionTimes() {
      const parsed = JSON.stringify(this.currentTimes);
      if (this.$store.state.session === 1) {
        localStorage.setItem("solves", parsed);
      } else if (this.$store.state.session === 2) {
        localStorage.setItem("solves2", parsed);
      }
    },
  },
  methods: {
    toggleOrder() {
      this.sortDesc = !this.sortDesc;
    },
    dnf(session, index) {
      this.$store.commit("dnf", { session: session, index: index });
    },
    plusTwo(session, index) {
      if (
        !this.currentSessionTimes[index - 1].plusTwo &&
        this.currentSessionTimes[index - 1].baseTime !== "DNF"
      ) {
        this.$store.commit("plusTwo", { session: session, index: index });
        this.$store.commit("buttonPressed", {
          session: session,
          index: index,
          prop: "plusTwo",
        });
      }
    },
    removeTime(session, index) {
      this.$store.commit("removeTime", { session: session, index: index });
    },
    clearTimes() {
      this.$store.commit("clearTimes", this.$store.state.session);
    },
    addTime() {
      this.$store.commit("addTime", {
        baseTime: this.convertDatetoTime(this.addedTime),
        time: this.addedTime,
        remove: null,
        plusTwo: false,
        dnf: false,
        session: this.$store.state.session,
      });
      this.dialog = false;
    },
    convertDatetoTime(date) {
      const t = date.split(":");
      return t.length >= 3
        ? +t[0] * 60000 + +t[1] * 1000 + +t[2] * 10
        : +t[0] * 1000 + +t[1] * 10;
    },
    convertTime(time) {
      const format = time > 60000 ? "M:ss:L" : "ss:L";
      const date = new Date(time);
      return dateFormat(date, format);
    },
  },
};
</script>
<style scoped>
.footer-text {
  font-size: 0.75rem;
}
.solve-table {
  overflow: auto;
  max-height: 70vh;
}
.disable-cursor {
  cursor: not-allowed !important;
}
.danger-text {
  color: #d32f2f;
}
.text-start span {
  margin-right: -1.7rem;
  padding-left: 0.7rem;
}
.text-start h4 {
  margin-right: -1.7rem;
  padding-left: 0.7rem;
}
.pointer {
  cursor: pointer;
}
.card {
  box-shadow: none !important;
}
.session-select {
  width: 4rem;
}
</style>
