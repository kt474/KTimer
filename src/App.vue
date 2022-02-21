<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <keep-alive>
      <v-navigation-drawer
        permanent
        class="navigation-drawer"
        v-if="drawer && !hideChartDuringSolve"
        v-model="drawer"
        width="340"
        app
      >
        <side-nav />
      </v-navigation-drawer>
    </keep-alive>
    <nav-bar @openDrawer="onClickChild" />
    <v-main class="main">
      <timer />
      <chart class="mt-n2" />
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
    onClickChild(value) {
      this.drawer = value;
    }
  }
};
</script>
<style scoped>
.main::-webkit-scrollbar {
  display: none;
}
.main {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
