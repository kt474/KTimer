<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Scramble</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    drawer: true,
  }),
  methods: {
    openDrawer() {
      this.drawer = !this.drawer;
      this.$emit("openDrawer", this.drawer);
    },
  },
};
</script>

<style></style>
