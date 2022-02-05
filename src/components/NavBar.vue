<template>
  <v-app-bar :value="hideNav" app color="primary" dark>
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <div class="d-flex align-center">
      <v-toolbar-title class="text-h5 mr-3">Scramble: </v-toolbar-title>
      <v-select
        v-if="showSelect"
        dense
        height="20"
        v-model="scrambleType"
        :items="items"
        @change="changeSelect"
        class="mt-6 mr-4 scramble-select"
        filled
      ></v-select>
    </div>
    <div class="d-flex justify-center align-center">
      <h5
        class="mr-5 text-h5"
        v-for="(i, index) in currentScramble"
        :key="index"
      >
        {{ i }}
      </h5>
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
  methods: {
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
  }
};
</script>

<style>
.scramble-select {
  width: 6rem;
  font-size: 1.25rem;
}
</style>
