<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="text-h5 mr-3">Scramble: </v-toolbar-title>
    <div class="d-flex justify-center align-center">
      <h5
        class="mr-6 text-h5"
        v-for="(i, index) in currentScramble"
        :key="index"
      >
        {{ i }}<span v-if="index != 19">,</span>
      </h5>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    drawer: true,
  }),
  computed: {
    currentScramble() {
      return this.$store.state.currentScramble;
    },
  },
  methods: {
    openDrawer() {
      this.drawer = !this.drawer;
      this.$emit("openDrawer", this.drawer);
    },
  },
};
</script>

<style></style>
