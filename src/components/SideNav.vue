<template>
  <v-card height="400" width="300" class="mx-auto card">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          Timer
        </v-list-item-title>
        <v-list-item-subtitle>
          Session 1
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <v-list dense nav>
      <div class="stats-heading">
        <v-btn depressed small color="error" @click="clearTimes()" class="my-2">
          Reset
        </v-btn>
        <h4 class="font-weight-regular">ao5: {{ averageFive }}</h4>
        <h4 class="font-weight-regular">ao12: {{ averageTwelve }}</h4>
      </div>
    </v-list>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="currentTimes"
      :items-per-page="50"
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
        <v-icon @click="removeTime(item.name)" medium color="red darken-2">
          mdi-close
        </v-icon>
      </template>
      <template v-slot:[`item.plusTwo`]="{ item }">
        <h4
          v-if="$store.state.times[item.name - 1].plusTwo"
          :class="{
            'disable-cursor': $store.state.times[item.name - 1].plusTwo,
          }"
          class="plus-two"
        >
          +2
        </h4>
        <h4
          v-else
          class="font-weight-regular pointer"
          :class="{
            'disable-cursor': $store.state.times[item.name - 1].dnf,
          }"
          @click="plusTwo(item.name)"
        >
          +2
        </h4>
      </template>
      <template v-slot:[`item.dnf`]="{ item }">
        <h4
          class="font-weight-regular pointer"
          :class="{
            'disable-cursor': $store.state.times[item.name - 1].dnf,
          }"
          @click="dnf(item.name)"
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
  data() {
    return {
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
    currentTimes() {
      let temp = this.$store.state.times;
      temp.forEach((item, index) => {
        item["name"] = index + 1;
      });
      return temp;
    },
    averageFive() {
      let currentLength = this.$store.getters.length;
      if (currentLength >= 5) {
        let temp = this.$store.state.times.map((time) => time.baseTime);
        temp = temp.slice(currentLength - 5, currentLength + 1);
        let dnfCount = temp.filter((time) => time == "DNF").length;
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
      return "0:00";
    },
    averageTwelve() {
      let currentLength = this.$store.getters.length;
      if (currentLength >= 12) {
        let temp = this.$store.state.times.map((time) => time.baseTime);
        temp = temp.slice(currentLength - 12, currentLength + 1);
        let dnfCount = temp.filter((time) => time == "DNF").length;
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
      return "0:00";
    },
  },
  methods: {
    dnf(index) {
      this.$store.commit("dnf", index);
    },
    plusTwo(index) {
      if (
        !this.$store.state.times[index - 1].plusTwo &&
        this.$store.state.times[index - 1].baseTime !== "DNF"
      ) {
        this.$store.commit("plusTwo", index);
        this.$store.commit("buttonPressed", { index: index, prop: "plusTwo" });
      }
    },
    removeTime(index) {
      this.$store.commit("removeTime", index);
    },
    clearTimes() {
      this.$store.commit("clearTimes");
    },
    convertTime(time) {
      let date = new Date(time);
      return dateFormat(date, "ss:L");
    },
  },
};
</script>
<style scoped>
.disable-cursor {
  cursor: not-allowed !important;
}
.plus-two {
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
.stats-heading {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.flex {
  display: flex;
}
</style>
