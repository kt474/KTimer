<template>
  <v-container class="main">
    <p class="timer">{{ time }}</p>
  </v-container>
</template>

<script>
import dateFormat from "dateformat";
export default {
  name: "Timer",

  data: () => ({
    currentTime: 0,
    resetTime: false,
  }),

  mounted() {
    window.addEventListener("keyup", (e) => {
      if (e.code == "Space") {
        this.onSpacebar();
      }
    });
  },
  computed: {
    time() {
      let format = this.currentTime > 60000 ? "M:ss:L" : "ss:L";
      let date = new Date(this.currentTime);
      return dateFormat(date, format);
    },
  },

  methods: {
    onSpacebar() {
      if (this.resetTime) {
        this.reset();
        this.currentTime = 0;
        this.resetTime = false;
      }
      if (this.currentTime == 0) {
        this.start();
      } else if (this.currentTime !== 0) {
        this.stop();
        this.$store.commit("addTime", {
          baseTime: this.currentTime,
          time: this.time,
          remove: null,
          plusTwo: false,
          dnf: false,
        });
        this.resetTime = true;
      }
    },
    start() {
      this.timer = setInterval(() => {
        this.currentTime += 10;
      }, 10);
    },
    stop() {
      clearInterval(this.timer);
    },
    reset() {
      this.currentTime = 0;
      this.savedTime = 0;
    },
  },
};
</script>
<style scoped>
.main {
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.timer {
  font-size: 14rem;
}
</style>
