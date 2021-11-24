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
        <h4 class="font-weight-medium">ao5: {{ averageFive }}</h4>
        <h4 class="font-weight-medium">ao12: {{ averageTwelve }}</h4>
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
      <template v-slot:[`item.remove`]="{ item }">
        <!-- <v-chip :color="getColor(item.calories)" dark>
          {{ item.calories }}
        </v-chip> -->
        <v-icon @click="removeTime(item.name)" medium color="red darken-2">
          mdi-close
        </v-icon>
        {{ item.remove }}
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
        temp.sort((a, b) => a - b);
        temp.shift();
        temp.pop();
        return this.convertTime(mean(temp));
      }
      return "0:00";
    },
  },
  methods: {
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
.card {
  box-shadow: none !important;
}
.stats-heading {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
