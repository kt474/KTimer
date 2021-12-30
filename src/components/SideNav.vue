<template>
  <v-card height="400" width="350" class="mx-auto card">
    <v-list-item>
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
    <v-list dense nav>
      <div>
        <div class="d-flex justify-space-between align-center">
          <v-btn
            depressed
            small
            color="error"
            @click="clearTimes()"
            class="my-2"
          >
            Reset
          </v-btn>
          <h4 class="font-weight-regular">ao5: {{ averageFive }}</h4>
          <h4 class="font-weight-regular pr-3">ao12: {{ averageTwelve }}</h4>
        </div>
        <div class="d-flex justify-space-between align-center">
          <v-dialog v-model="dialog" max-width="400px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                depressed
                class="my-2"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Add Time
              </v-btn>
            </template>
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
          <h4 class="font-weight-regular pr-2">Mean: {{ currentMean }}</h4>
          <h4 class="font-weight-regular pr-4">Best: {{ currentBest }}</h4>
        </div>
        <v-divider></v-divider>
        <div class="d-flex align-center">
          <v-dialog v-model="settings" max-width="400px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                icon
                class="mt-2"
                color="black"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-cog</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="primary" class="text-h5" dark
                >Settings</v-toolbar
              >
              <v-card-text>
                <v-checkbox
                  class="mt-4"
                  v-model="sortDesc"
                  label="Sort Descending"
                ></v-checkbox>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="settings = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <h3 class="mt-2 mx-auto">Solves: {{ solves }}</h3>
        </div>
      </div>
    </v-list>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="currentTimes"
      :items-per-page="50"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hide-default-header
      hide-default-footer
      class="elevation-0"
    >
      <template v-slot:[`item.name`]="{ item }">
        <p class="font-weight-bold mb-0">{{ item.name }}</p>
      </template>
      <template v-slot:[`item.time`]="{ item }">
        <p class="font-weight-bold mb-0">{{ item.time }}</p>
      </template>
      <template v-slot:[`item.remove`]="{ item }">
        <v-icon
          @click="removeTime(item.session, item.name)"
          medium
          color="red darken-2"
        >
          mdi-close
        </v-icon>
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
      sortDesc: true,
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
