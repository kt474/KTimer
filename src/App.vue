<template>
  <v-app>
    <v-navigation-drawer
      class="navigation-drawer"
      v-if="drawer"
      v-model="drawer"
      permanent
      width="340"
      app
    >
      <side-nav />
    </v-navigation-drawer>
    <nav-bar @openDrawer="onClickChild" />
    <v-main>
      <timer />
      <chart />
    </v-main>
  </v-app>
</template>

<script>
import Timer from "./components/Timer.vue";
import SideNav from "./components/SideNav.vue";
import NavBar from "./components/NavBar.vue";
import Chart from "./components/Chart.vue";
export default {
  name: "App",
  data() {
    return {
      drawer: true,
    };
  },
  components: {
    Timer,
    SideNav,
    NavBar,
    Chart,
  },
  methods: {
    onClickChild(value) {
      this.drawer = value;
    },
  },
};
</script>
<style scoped>
.navigation-drawer >>> .v-navigation-drawer__content {
  overflow: hidden;
}
</style>
