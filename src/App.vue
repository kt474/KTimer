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
    <v-main>
      <div
        class="d-flex align-center justify-center timer-component"
        :style="{ height: timerHeight }"
      >
        <timer />
      </div>
      <div
        v-if="!hideChartDuringSolve"
        class="d-flex justify-center mt-6 max-width"
      >
        <div v-if="hideDivider" class="divider mt-n2"></div>
        <chart />
        <scramble-display />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import Timer from "./components/Timer.vue";
import SideNav from "./components/SideNav.vue";
import NavBar from "./components/NavBar.vue";
import Chart from "./components/Chart.vue";
import scrambleDisplay from "./components/scrambleDisplay.vue";
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
    Chart,
    scrambleDisplay
  },
  computed: {
    hideDivider() {
      return (
        !this.$store.state.removeChart ||
        !this.$store.state.removeScrambleDisplay
      );
    },
    bothComponentsHidden() {
      return (
        this.$store.state.removeScrambleDisplay & this.$store.state.removeChart
      );
    },
    chartHeight() {
      return this.$store.state.chartHeight;
    },
    timerHeight() {
      return this.hideChartDuringSolve || this.bothComponentsHidden
        ? "95%"
        : "calc(100% - " + (this.chartHeight + 40) + "px)";
    },
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
<style scoped>
.max-width {
  width: 100%;
}
.divider {
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin-bottom: 4px;
}
</style>
