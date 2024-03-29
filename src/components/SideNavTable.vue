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
            Type:
            <span class="font-weight-regular">{{
              clickedSolve.scrambleType
            }}</span>
          </p>
          <p class="text-h6">
            Scramble:
            <span class="font-weight-regular">
              {{ clickedSolve.scramble ? clickedSolve.scramble : "" }}
            </span>
          </p>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="solveModal = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="currentTimes"
      :items-per-page="1000"
      :sort-by.sync="sortBy"
      :sort-desc.sync="tableSortProp"
      hide-default-header
      hide-default-footer
      mobile-breakpoint="0"
      :style="{ background: $vuetify.theme.themes[theme].background }"
      class="elevation-0 enable-scroll"
      :class="{
        'phone-table-height': isPhone,
        'tablet-table-height': isTablet,
        'desktop-table-height': isDesktop
      }"
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
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    tableSortProp() {
      return this.sortDesc;
    },
    isPhone() {
      return this.$vuetify.breakpoint.xs;
    },
    isTablet() {
      return this.$vuetify.breakpoint.md || this.$vuetify.breakpoint.sm;
    },
    isDesktop() {
      return !this.isPhone && !this.isTablet;
    },
    currentSessionTimes() {
      return this.$store.state["times" + this.$store.state.session];
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
h4:hover {
  color: #d32f2f;
  font-weight: bold !important;
}
.phone-table-height {
  max-height: 300px;
}
.tablet-table-height {
  max-height: 450px;
}
.desktop-table-height {
  max-height: 62vh;
}
.enable-scroll {
  overflow: auto !important;
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
  margin-right: -1.9rem;
  padding-left: 0.7rem;
}
</style>
