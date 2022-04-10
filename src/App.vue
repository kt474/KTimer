<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <keep-alive>
      <v-navigation-drawer
        permanent
        v-if="drawer && !hideChartDuringSolve"
        v-model="drawer"
        width="340"
        app
      >
        <side-nav @closeDrawer="onClickChild" />
      </v-navigation-drawer>
    </keep-alive>
    <nav-bar @openDrawer="onClickChild" :current-drawer-state="this.drawer" />
    <v-main class="d-flex align-center justify-center">
      <timer class="mt-n12" />
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
      drawer: true
    };
  },
  components: {
    Timer,
    SideNav,
    NavBar,
    Chart
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    hideChartDuringSolve() {
      return this.$store.state.isSolving && this.$store.state.hideAll;
    }
  },
  methods: {
    onClickChild() {
      this.drawer = !this.drawer;
    }
  }
};
</script>
