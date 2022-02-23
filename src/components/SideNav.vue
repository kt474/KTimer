<template>
  <v-card width="340" class="mx-auto card">
    <v-list-item class="px-3">
      <div>
        <v-list-item-title class="d-flex align-middle pt-2">
          <img
            alt="logo"
            width="24"
            height="24"
            src="../assets/logo.svg"
            class="mt-1 mr-2"
          />
          <p class="text-h6">KTimer</p>
        </v-list-item-title>
        <div class="d-flex mt-1">
          <label for="session" class="text--secondary pr-3">
            Session
          </label>
          <v-select
            id="session"
            v-if="showSelect"
            dense
            height="20"
            v-model="session"
            :items="items"
            @change="changeSelect"
            class="mt-0 session-select"
          ></v-select>
        </div>
      </div>
    </v-list-item>
    <v-divider></v-divider>
    <side-nav-stats />
    <v-divider></v-divider>
    <side-nav-settings @sortDesc="updateSettings" />
    <v-divider></v-divider>
    <side-nav-table :sort-desc="sortDesc" />
    <v-divider></v-divider>
    <div v-if="isPhone" class="d-flex justify-center mt-2">
      <v-btn @click="closeDrawer" small aria-label="drawer">Close Menu</v-btn>
    </div>
  </v-card>
</template>
<script>
import sideNavTable from "@/components/SideNavTable";
import sideNavStats from "@/components/SideNavStats";
import sideNavSettings from "@/components/SideNavSettings";
export default {
  name: "SideNav",
  components: {
    sideNavTable,
    sideNavStats,
    sideNavSettings
  },
  data() {
    return {
      showSelect: true,
      sortDesc: true,
      session: 1,
      items: [1, 2]
    };
  },
  computed: {
    isPhone() {
      return this.$vuetify.breakpoint.xs;
    }
  },
  mounted() {
    if (localStorage.session) {
      this.session = JSON.parse(localStorage.session);
    }
  },
  watch: {
    session() {
      localStorage.session = this.session;
      this.$store.commit("updateSession", this.session);
    }
  },
  methods: {
    closeDrawer() {
      this.$emit("closeDrawer");
    },
    changeSelect() {
      this.showSelect = false;
      this.$nextTick(() => {
        this.showSelect = true;
      });
    },
    updateSettings(value) {
      this.sortDesc = value;
    }
  }
};
</script>
<style scoped>
.card {
  height: 100%;
  overflow: hidden !important;
  box-shadow: none !important;
}
.session-select {
  width: 4rem;
}
</style>
