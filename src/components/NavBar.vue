<template>
  <v-app-bar :height="navBarHeight" :value="hideNav" app color="primary" dark>
    <v-app-bar-nav-icon
      @click="openDrawer"
      aria-label="drawer"
    ></v-app-bar-nav-icon>
    <div class="mt-n6 wrapper">
      <div class="d-flex align-center mx-auto mt-3 select-wrapper">
        <label for="scramble">
          <v-toolbar-title class="text-h5 mr-3">
            Scramble:
          </v-toolbar-title>
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
        :class="isTablet ? 'max-width-mobile' : 'max-width-desktop'"
      >
        <p class="scramble-p">{{ currentScrambleText }}</p>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import { mdiRefresh } from "@mdi/js";
export default {
  name: "NavBar",
  data: () => ({
    refreshIcon: mdiRefresh,
    items: ["2x2", "3x3", "4x4", "5x5"],
    scrambleType: "3x3",
    showSelect: true,
    drawer: true
  }),
  computed: {
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
          "4x4": 225,
          "5x5": 275
        },
        tablet: {
          "2x2": 100,
          "3x3": 120,
          "4x4": 170,
          "5x5": 200
        },
        desktop: {
          "2x2": 100,
          "3x3": 100,
          "4x4": 140,
          "5x5": 150
        }
      };
      if (this.isPhone) {
        return heights.phone[this.scrambleType];
      } else if (this.isTablet) {
        return heights.tablet[this.scrambleType];
      } else return heights.desktop[this.scrambleType];
    },
    currentScrambleText() {
      return this.currentScramble.join(" ");
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
  watch: {
    scrambleType() {
      localStorage.scrambleType = this.items.indexOf(this.scrambleType);
      this.$store.commit(
        "updateScrambleType",
        this.items[localStorage.scrambleType]
      );
      this.newScramble();
    }
  },
  methods: {
    newScramble() {
      let newScramble;
      if (this.scrambleType === "3x3") {
        newScramble = this.generateScramble(20);
      } else if (this.scrambleType === "2x2") {
        newScramble = this.generateScramble(9);
      } else if (this.scrambleType === "4x4") {
        newScramble = this.generateBigScramble(40);
      } else if (this.scrambleType === "5x5") {
        newScramble = this.generateBigScramble(50);
      }
      this.$store.commit("newScramble", newScramble);
    },
    changeSelect() {
      this.showSelect = false;
      this.$nextTick(() => {
        this.showSelect = true;
      });
    },
    openDrawer() {
      this.drawer = !this.drawer;
      this.$emit("openDrawer", this.drawer);
    },
    generateBigScramble(length) {
      const pool = ["R", "U", "L", "D", "B", "F"];
      const append = ["2", "'", "", "w", "w'", "w2"];
      const baseMoves = [pool[Math.floor(Math.random() * 6)]];
      for (let i = 1; i < length; i++) {
        const newMove = pool[Math.floor(Math.random() * 6)];
        if (baseMoves[i - 1] === newMove) {
          const newPool = pool.filter(move => move !== newMove);
          baseMoves.push(newPool[Math.floor(Math.random() * 5)]);
        } else {
          baseMoves.push(newMove);
        }
      }
      const result = [];
      baseMoves.forEach(move => {
        if (length === 40) {
          if (["R", "U", "F"].includes(move)) {
            result.push(move + append[Math.floor(Math.random() * 6)]);
          } else {
            result.push(
              move + append.slice(0, 4)[Math.floor(Math.random() * 3)]
            );
          }
        } else result.push(move + append[Math.floor(Math.random() * 6)]);
      });
      return result;
    },
    generateScramble(length) {
      const pool = ["R", "U", "L", "D", "B", "F"];
      const append = ["2", "'", ""];
      const baseMoves = [pool[Math.floor(Math.random() * 6)]];
      for (let i = 1; i < length; i++) {
        const newMove = pool[Math.floor(Math.random() * 6)];
        if (baseMoves[i - 1] === newMove) {
          const newPool = pool.filter(move => move !== newMove);
          baseMoves.push(newPool[Math.floor(Math.random() * 5)]);
        } else {
          baseMoves.push(newMove);
        }
      }
      const result = [];
      baseMoves.forEach(move => {
        result.push(move + append[Math.floor(Math.random() * 3)]);
      });
      return result;
    }
  },
  mounted() {
    if (localStorage.scrambleType) {
      this.scrambleType = this.items[localStorage.scrambleType];
      this.$store.commit(
        "updateScrambleType",
        this.items[localStorage.scrambleType]
      );
    }
    this.newScramble();
  }
};
</script>

<style>
.select-wrapper {
  width: 300px;
}
.scramble-select {
  width: 10px;
  font-size: 1.25rem;
}
.max-width-mobile {
  max-width: 550px;
}
.max-width-desktop {
  max-width: 900px;
}
.scramble-text {
  font-size: 1.5rem;
  letter-spacing: 4px;
  line-height: 1.5rem;
  text-align: center;
}
.scramble-p {
  line-height: 1.7rem;
}
.wrapper {
  width: 100%;
}
</style>
