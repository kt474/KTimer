<template>
  <v-app-bar height="90" :value="hideNav" app color="primary" dark>
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <div class="mt-n6 wrapper">
      <div class="d-flex align-center mx-auto select-wrapper">
        <v-toolbar-title class="text-h5 mr-3">Scramble: </v-toolbar-title>
        <v-select
          v-if="showSelect"
          dense
          outlined
          v-model="scrambleType"
          :items="items"
          @change="changeSelect"
          class="mt-6 mr-4 scramble-select"
        ></v-select>
        <v-btn
          fab
          dark
          height="35"
          width="35"
          color="#26C6DA"
          class="mb-1"
          @click.stop="newScramble"
        >
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
      </div>
      <div class="d-flex justify-center mx-auto scramble-text mt-n6">
        <h5
          class="mr-4 text-h5"
          v-for="(i, index) in currentScramble"
          :key="index"
        >
          {{ i }}
        </h5>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    items: ["2x2", "3x3", "4x4"],
    scrambleType: "3x3",
    showSelect: true,
    drawer: true
  }),
  computed: {
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
    }
  },
  methods: {
    newScramble() {
      console.log("button clicked");
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
    }
  },
  mounted() {
    if (localStorage.scrambleType) {
      this.scrambleType = this.items[localStorage.scrambleType];
    }
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
.scramble-text {
  max-width: 1000px;
  overflow: auto;
}
.wrapper {
  width: 100%;
}
</style>
