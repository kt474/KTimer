<template>
  <div>
    <v-dialog overlay-opacity="0.2" v-model="solveModal" max-width="400px">
      <v-card>
        <v-toolbar color="primary" class="text-h5" dark>
          Solve {{ clickedSolve.name }}
        </v-toolbar>
        <div class="ma-2 pa-2">
          <p class="text-h6">
            Time:
            <span class="font-weight-regular">{{ clickedSolve.time }}</span>
          </p>
          <p class="text-h6">
            Scramble:
            <span class="font-weight-regular">
              {{ clickedSolve.scramble ? clickedSolve.scramble.join(" ") : "" }}
            </span>
          </p>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="solveModal = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        <p class="font-weight-bold mb-0 pointer" @click="openSolveModal(item)">
          {{ item.time }}
        </p>
      </template>
      <template v-slot:[`item.remove`]="{ item }">
        <v-btn
          aria-label="close"
          text
          icon
          @click="removeTime(item.session, item.name)"
          medium
          color="red darken-2"
        >
          <v-icon large class="mr-3">
            {{ closeIcon }}
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.plusTwo`]="{ item }">
        <h4
          v-if="currentSessionTimes[item.name - 1].plusTwo"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].plusTwo
          }"
          class="danger-text"
        >
          +2
        </h4>
        <h4
          v-else
          class="font-weight-regular pointer"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].dnf
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
            'disable-cursor': currentSessionTimes[item.name - 1].dnf
          }"
          class="danger-text"
        >
          DNF
        </h4>
        <h4
          v-else
          class="font-weight-regular pointer"
          :class="{
            'disable-cursor': currentSessionTimes[item.name - 1].dnf
          }"
          @click="dnf(item.session, item.name)"
        >
          DNF
        </h4>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mdiClose } from "@mdi/js";
export default {
  name: "SideNavTable",
  props: ["sortDesc"],
  data() {
    return {
      closeIcon: mdiClose,
      solveModal: false,
      sortBy: "name",
      clickedSolve: {},
      headers: [
        {
          text: "Times",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "time", value: "time" },
        { text: "plusTwo", value: "plusTwo" },
        { text: "dnf", value: "dnf" },
        { text: "remove", value: "remove" }
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
    currentTimes() {
      const times = this.currentSessionTimes;
      times.forEach((item, index) => {
        item["name"] = index + 1;
      });
      return times;
    }
  },
  methods: {
    openSolveModal(item) {
      this.solveModal = true;
      this.clickedSolve = item;
    },
    removeTime(session, index) {
      this.$store.commit("removeTime", { session: session, index: index });
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
          prop: "plusTwo"
        });
      }
    },
    dnf(session, index) {
      this.$store.commit("dnf", { session: session, index: index });
    }
  }
};
</script>

<style scoped>
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
.pointer {
  cursor: pointer;
}
.text-start span {
  margin-right: -1.7rem;
  padding-left: 0.7rem;
}
.text-start h4 {
  margin-right: -1.7rem;
  padding-left: 0.7rem;
}
</style>
