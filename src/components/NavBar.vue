<template>
  <v-app-bar :height="navBarHeight" :value="hideNav" app color="primary" dark>
    <v-app-bar-nav-icon
      @click="openDrawer"
      aria-label="drawer"
    ></v-app-bar-nav-icon>
    <div v-if="!hideScramble" class="wrapper">
      <div class="d-flex align-center mx-auto" :class="selectWidth">
        <label>
          <v-toolbar-title class="text-h5 mr-3"> Scramble: </v-toolbar-title>
        </label>
        <v-select
          id="scramble"
          v-if="showSelect"
          dense
          outlined
          v-model="scrambleType"
          :items="items"
          @change="changeSelect"
          class="mt-6 mr-4 scramble-select"
        ></v-select>
        <v-btn
          rounded
          small
          dark
          height="30"
          width="30"
          color="primary lighten-1"
          class="mb-1"
          aria-label="scramble"
          @click.stop="newScramble"
        >
          <v-icon small>{{ refreshIcon }}</v-icon>
        </v-btn>
      </div>
      <div
        class="d-flex justify-center mx-auto mt-n4 text-wrap scramble-text"
        :class="scrambleWidth"
      >
        <v-progress-linear
          v-if="showLoader"
          class="progress-bar"
          indeterminate
          rounded
          color="primary lighten-3"
          height="6"
        ></v-progress-linear>
        <p v-else :class="scrambleFont">
          {{ currentScramble }}
        </p>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import { mdiRefresh } from "@mdi/js";
import { randomScrambleForEvent } from "cubing/scramble";
export default {
  name: "NavBar",
  props: ["currentDrawerState"],
  data: () => ({
    refreshIcon: mdiRefresh,
    items: [
      "2x2",
      "3x3",
      "4x4",
      "5x5",
      "6x6",
      "7x7",
      "Clock",
      "Megaminx",
      "Pyraminx",
      "Skewb",
      "Square-1"
    ],
    scrambleType: "3x3",
    initialType: false,
    scrambleMapping: {
      "2x2": "222",
      "3x3": "333",
      "4x4": "444",
      "5x5": "555",
      "6x6": "666",
      "7x7": "777",
      Clock: "clock",
      Megaminx: "minx",
      Pyraminx: "pyram",
      Skewb: "skewb",
      "Square-1": "sq1"
    },
    showSelect: true
  }),
  computed: {
    hideScramble() {
      return this.currentDrawerState & this.isPhone;
    },
    selectWidth() {
      if (this.scrambleType === "Megaminx") {
        return "select-wrapper-big";
      }
      return "select-wrapper-normal";
    },
    scrambleFont() {
      if (
        this.scrambleType === "6x6" ||
        this.scrambleType === "7x7" ||
        this.scrambleType === "Megaminx"
      ) {
        return "scramble-font-big";
      }
      return "scramble-font-normal";
    },
    showLoader() {
      return this.$store.state.showLoader;
    },
    scrambleWidth() {
      if (this.isPhone) {
        return "max-width-mobile";
      } else if (this.isTablet) {
        return "max-width-tablet";
      }
      return "max-width-desktop";
    },
    isPhone() {
      return this.$vuetify.breakpoint.xs;
    },
    isTablet() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    navBarHeight() {
      const heights = {
        phone: {
          "2x2": 120,
          "3x3": 145,
          "4x4": 250,
          "5x5": 325,
          "6x6": 305,
          "7x7": 370,
          Clock: 170,
          Megaminx: 260,
          Pyraminx: 120,
          Skewb: 120,
          "Square-1": 205
        },
        tablet: {
          "2x2": 100,
          "3x3": 120,
          "4x4": 185,
          "5x5": 225,
          "6x6": 210,
          "7x7": 245,
          Clock: 150,
          Megaminx: 190,
          Pyraminx: 100,
          Skewb: 100,
          "Square-1": 155
        },
        desktop: {
          "2x2": 100,
          "3x3": 100,
          "4x4": 150,
          "5x5": 170,
          "6x6": 170,
          "7x7": 190,
          Clock: 120,
          Megaminx: 150,
          Pyraminx: 100,
          Skewb: 100,
          "Square-1": 125
        }
      };
      if (this.isPhone) {
        return heights.phone[this.scrambleType];
      } else if (this.isTablet) {
        return heights.tablet[this.scrambleType];
      } else return heights.desktop[this.scrambleType];
    },
    currentScramble() {
      return this.$store.state.currentScramble;
    },
    hideAll() {
      return this.$store.state.hideAll;
    },
    isSolving() {
      return this.$store.state.isSolving;
    },
    hideNav() {
      if (!this.isSolving) {
        return true;
      }
      return !(this.hideAll && this.isSolving);
    }
  },
  watch: {},
  methods: {
    async newScramble() {
      this.$store.commit("updateShowLoader", true);
      let scr = await randomScrambleForEvent(
        this.scrambleMapping[this.scrambleType]
      );
      this.$store.commit("updateShowLoader", false);
      let newScramble = scr.toString();
      this.$store.commit("newScramble", newScramble);
      localStorage.scramble = newScramble;
    },
    changeSelect() {
      this.newScramble();
      localStorage.scrambleType = this.items.indexOf(this.scrambleType);
      this.$store.commit(
        "updateScrambleType",
        this.items[localStorage.scrambleType]
      );
      this.showSelect = false;
      this.$nextTick(() => {
        this.showSelect = true;
      });
    },
    openDrawer() {
      this.$emit("openDrawer");
    }
  },
  async mounted() {
    if (localStorage.scrambleType) {
      this.initialType = false;
      this.scrambleType = this.items[localStorage.scrambleType];
      this.$store.commit(
        "updateScrambleType",
        this.items[localStorage.scrambleType]
      );
      this.initialType = true;
    }
    if (localStorage.scramble) {
      this.$store.commit("newScramble", localStorage.scramble);
    } else {
      const defaultScramble =
        "R F' L' F U B' L2 F' D' B2 U B2 U B2 D' F2 D F2 L' B2 L";
      this.$store.commit("newScramble", defaultScramble);
      localStorage.scramble = defaultScramble;
      //make sure the select menu is at 3x3
      this.scrambleType = "3x3";
      this.$store.commit("updateScrambleType", "3x3");
      localStorage.scrambleType = 1;
    }
    await randomScrambleForEvent(this.scrambleMapping[this.scrambleType]);
  }
};
</script>

<style>
.progress-bar {
  width: 50%;
  margin-top: 1rem;
}
.select-wrapper-normal {
  width: 330px;
}
.select-wrapper-big {
  width: 345px;
}
.scramble-select {
  font-size: 1.25rem;
}
.max-width-mobile {
  max-width: 330px;
}
.max-width-tablet {
  max-width: 600px;
}
.max-width-desktop {
  max-width: 900px;
}
.scramble-font-normal {
  font-size: 1.5rem;
  line-height: 1.7rem;
}
.scramble-font-big {
  font-size: 1.05rem;
  line-height: 1.4rem;
}
.scramble-text {
  letter-spacing: 4px;
  text-align: center;
}
.wrapper {
  z-index: -1;
  width: 100%;
  position: absolute;
  top: -1rem;
}
</style>
