<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <keep-alive>
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
    </keep-alive>
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
.navigation-drawer >>> .v-navigation-drawer__content {
  overflow: hidden;
}
</style>
