<template>
  <v-container class="d-flex justify-center align-center main">
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
    scramble: [],
  }),

  mounted() {
    window.addEventListener("keyup", (e) => {
      if (e.code == "Space") {
        this.onSpacebar();
      }
    });
    this.generateSramble();
    this.$store.commit("newScramble", this.scramble);
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
          session: this.$store.state.session,
          scramble: this.scramble,
        });
        this.generateSramble();
        this.$store.commit("newScramble", this.scramble);
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
    generateSramble() {
      const pool = ["R", "U", "L", "D", "B", "F"];
      const append = ["2", "'", ""];
      const baseMoves = [pool[Math.floor(Math.random() * 6)]];
      for (let i = 1; i < 20; i++) {
        const newMove = pool[Math.floor(Math.random() * 6)];
        if (baseMoves[i - 1] === newMove) {
          const newPool = pool.filter((move) => move !== newMove);
          baseMoves.push(newPool[Math.floor(Math.random() * 5)]);
        } else {
          baseMoves.push(newMove);
        }
      }
      const result = [];
      baseMoves.forEach((move) => {
        result.push(move + append[Math.floor(Math.random() * 3)]);
      });
      this.scramble = result;
    },
  },
};
</script>
<style scoped>
.main {
  height: 90%;
}
.timer {
  font-size: 14rem;
}
</style>
