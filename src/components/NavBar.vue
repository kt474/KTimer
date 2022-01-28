<template>
  <v-app-bar :value="hideNav" app color="primary" dark>
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="text-h5 mr-3">Scramble: </v-toolbar-title>
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
    openDrawer() {
      this.drawer = !this.drawer;
      this.$emit("openDrawer", this.drawer);
    }
  }
};
</script>

<style></style>
