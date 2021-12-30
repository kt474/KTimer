<template>
  <v-container class="d-flex justify-center align-center main">
    <p class="timer" :class="{ 'timer-color': greenTimer }">
      {{ time }}
    </p>
  </v-container>
</template>

<script>
import dateFormat from "dateformat";
export default {
  name: "Timer",
  data: () => ({
    currentTime: 0,
    greenTimer: false,
    resetTime: true,
    timeStep: 400,
    pressedAt: 0,
    startEnable: false,
    scramble: [],
  }),

  mounted() {
    window.addEventListener("keypress", this.onKeyPress);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("keydown", this.onKeyDown);
    this.generateSramble();
    this.$store.commit("newScramble", this.scramble);
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.onKeyPress);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("keydown", this.onKeyDown);
  },
  computed: {
    time() {
      let format = this.currentTime > 60000 ? "M:ss:L" : "ss:L";
      let date = new Date(this.currentTime);
      return dateFormat(date, format);
    },
  },
  methods: {
    onKeyDown(event) {
      if (event.code == "Space") {
        if (this.pressedAt == 0) {
          this.pressedAt = Date.now();
        }
        if (Date.now() - this.pressedAt >= this.timeStep) {
          this.startEnable = true;
          this.pressedAt = 0;
        }
      }
    },
    onKeyPress(event) {
      if (event.code == "Space") {
        if (this.resetTime) {
          this.greenTimer = true;
          this.currentTime = 0;
        }
      }
    },
    onKeyUp(event) {
      if (event.code == "Space") {
        this.pressedAt = 0;
        this.onSpacebar();
      }
    },
    onSpacebar() {
      if (this.resetTime) {
        this.reset();
        this.resetTime = false;
      }
      if (this.currentTime == 0 && this.startEnable) {
        this.start();
        this.startEnable = false;
        this.greenTimer = false;
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
      } else {
        this.greenTimer = false;
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
.timer-color {
  animation-name: color-change;
  animation-fill-mode: forwards;
  animation-duration: 400ms;
  animation-timing-function: step-end;
  color: #000;
}
@keyframes color-change {
  0% {
    color: #ff1744;
  }
  100% {
    color: #00c853;
  }
}
</style>
