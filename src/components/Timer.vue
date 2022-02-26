<template>
  <v-container
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    class="d-flex justify-center align-center py-4"
    :class="{ 'timer-height': noChart }"
  >
    <p
      :style="`font-size: ${timerSize}rem`"
      :class="{ 'timer-color': greenTimer }"
    >
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
    lastTime: 0,
    greenTimer: false,
    resetTime: true,
    timeStep: 400,
    pressedAt: 0,
    startEnable: false
  }),

  mounted() {
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("keydown", this.onKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("keydown", this.onKeyDown);
  },
  computed: {
    scrambleType() {
      return this.$store.state.scrambleType;
    },
    scramble() {
      return this.$store.state.currentScramble;
    },
    timerSize() {
      return this.$store.state.timerSize;
    },
    clickStart() {
      return this.$store.state.clickStart;
    },
    noChart() {
      return this.$store.state.removeChart;
    },
    time() {
      let format = this.currentTime > 60000 ? "M:ss:L" : "ss:L";
      let date = new Date(this.currentTime);
      return dateFormat(date, format);
    }
  },
  methods: {
    onTouchStart(event) {
      if (this.clickStart) {
        if (event.type === "touchstart") {
          event.preventDefault();
          this.pressedAt = Date.now();
          if (this.resetTime) {
            this.greenTimer = true;
          }
        }
      }
    },
    onTouchEnd(event) {
      if (this.clickStart) {
        if (event.type === "touchend") {
          if (
            (this.currentTime === 0 || this.currentTime === this.lastTime) &&
            Date.now() - this.pressedAt >= 400
          ) {
            this.startEnable = true;
            this.pressedAt = 0;
            this.onSpacebar();
          } else if (this.currentTime !== 0) {
            this.onSpacebar();
          } else {
            this.greenTimer = false;
            this.currentTime = 0;
          }
        }
      }
    },
    onMouseDown(event) {
      if (this.clickStart) {
        if (event.type === "mousedown") {
          event.preventDefault();
          this.pressedAt = Date.now();
          if (this.resetTime) {
            this.greenTimer = true;
          }
        }
      }
    },
    onMouseUp(event) {
      if (this.clickStart) {
        if (event.type === "mouseup") {
          if (
            (this.currentTime === 0 || this.currentTime === this.lastTime) &&
            Date.now() - this.pressedAt >= 400
          ) {
            this.startEnable = true;
            this.pressedAt = 0;
            this.onSpacebar();
          } else if (this.currentTime !== 0) {
            this.onSpacebar();
          } else {
            this.greenTimer = false;
            this.currentTime = 0;
          }
        }
      }
    },
    onKeyDown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        if (this.pressedAt === 0) {
          this.pressedAt = Date.now();
        }
        if (Date.now() - this.pressedAt >= this.timeStep) {
          this.startEnable = true;
          this.pressedAt = 0;
        }
        if (this.resetTime) {
          this.greenTimer = true;
        }
      }
    },
    onKeyUp(event) {
      if (event.code === "Space") {
        this.pressedAt = 0;
        this.onSpacebar();
      }
    },
    onSpacebar() {
      if (this.resetTime && this.startEnable) {
        this.reset();
        this.resetTime = false;
      }
      if (this.currentTime === 0 && this.startEnable) {
        this.lastTime = 0;
        this.$store.commit("updateIsSolving", true);
        this.start();
        this.startEnable = false;
        this.greenTimer = false;
      } else if (this.currentTime !== 0 && this.currentTime !== this.lastTime) {
        this.stop();
        this.lastTime = this.currentTime;
        this.$store.commit("updateIsSolving", false);
        this.$store.commit("addTime", {
          baseTime: this.currentTime,
          time: this.time,
          remove: null,
          plusTwo: false,
          dnf: false,
          session: this.$store.state.session,
          scramble: this.scramble,
          scrambleType: this.scrambleType
        });
        this.newScramble();
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
    },
    newScramble() {
      let newScramble;
      if (this.scrambleType === "3x3") {
        newScramble = this.generateScramble(20);
      } else if (this.scrambleType === "2x2") {
        newScramble = this.generateScramble(9);
      } else if (this.scrambleType === "4x4") {
        newScramble = this.generateBigScramble(35);
      } else if (this.scrambleType === "5x5") {
        newScramble = this.generateBigScramble(50);
      }
      this.$store.commit("newScramble", newScramble);
    },
    generateScramble(length) {
      const pool = ["R", "U", "L", "D", "B", "F"];
      const append = ["2", "'", ""];
      const baseMoves = [pool[Math.floor(Math.random() * 6)]];
      for (let i = 1; i < length; i++) {
        const newMove = pool[Math.floor(Math.random() * 6)];
        if (baseMoves[i - 1] === newMove) {
          const newPool = pool.filter(move => move !== newMove);
          baseMoves.push(newPool[Math.floor(Math.random() * 5)]);
        } else {
          baseMoves.push(newMove);
        }
      }
      const result = [];
      baseMoves.forEach(move => {
        result.push(move + append[Math.floor(Math.random() * 3)]);
      });
      return result;
    },
    generateBigScramble(length) {
      const pool = ["R", "U", "L", "D", "B", "F"];
      const append = ["2", "'", "", "w", "w'", "w2"];
      const baseMoves = [pool[Math.floor(Math.random() * 6)]];
      for (let i = 1; i < length; i++) {
        const newMove = pool[Math.floor(Math.random() * 6)];
        if (baseMoves[i - 1] === newMove) {
          const newPool = pool.filter(move => move !== newMove);
          baseMoves.push(newPool[Math.floor(Math.random() * 5)]);
        } else {
          baseMoves.push(newMove);
        }
      }
      const result = [];
      baseMoves.forEach(move => {
        result.push(move + append[Math.floor(Math.random() * 6)]);
      });
      return result;
    }
  }
};
</script>
<style scoped>
.timer-height {
  height: 90%;
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
