<template>
  <v-app>
    <v-navigation-drawer v-if="drawer" v-model="drawer" app>
      <side-nav />
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Scramble</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <Timer />
    </v-main>
  </v-app>
</template>

<script>
import Timer from "./components/Timer.vue";
import SideNav from "./components/SideNav.vue";
export default {
  name: "App",

  components: {
    Timer,
    SideNav,
  },

  data: () => ({
    drawer: true,
  }),
};
</script>
