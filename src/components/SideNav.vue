<template>
  <v-card height="400" width="256" class="mx-auto card">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          Timer
        </v-list-item-title>
        <v-list-item-subtitle>
          Session 1
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <v-list dense nav>
      <v-btn
        depressed
        small
        color="error"
        @click="clearTimes()"
        class="my-2 ml-2"
      >
        Reset
      </v-btn>
    </v-list>
    <v-data-table
      :headers="headers"
      :items="currentTimes"
      :items-per-page="50"
      hide-default-header
      hide-default-footer
      class="elevation-0"
    >
      <template v-slot:[`item.remove`]="{ item }">
        <!-- <v-chip :color="getColor(item.calories)" dark>
          {{ item.calories }}
        </v-chip> -->
        <v-icon @click="removeTime(item.name)" medium color="red darken-2">
          mdi-close
        </v-icon>
        {{ item.remove }}
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Times",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "time", value: "time" },
        { text: "remove", value: "remove" },
      ],
    };
  },
  computed: {
    currentTimes() {
      let temp = this.$store.state.times;
      temp.forEach((item, index) => {
        item["name"] = index + 1;
      });
      return temp;
    },
  },
  methods: {
    removeTime(index) {
      this.$store.commit("removeTime", index);
    },
    clearTimes() {
      this.$store.commit("clearTimes");
    },
  },
};
</script>
<style scoped>
.card {
  box-shadow: none !important;
}
</style>
