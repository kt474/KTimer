<template>
  <v-container
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    class="d-flex justify-center align-center py-4"
    :class="{ 'timer-height': noChart }"
  >
    <p :style="`font-size: ${timerSize}rem`" :class="timerColor">
      {{ inspectionActive ? inspectionTimer : time }}
    </p>
  </v-container>
</template>

<script>
import dateFormat from "dateformat";
export default {
  name: "Timer",
  data: () => ({
    timerId: 0,
    inspectionId: 0,
    currentTime: 0,
    lastTime: 0,
    greenTimer: false,
    resetTime: true,
    timeStep: 400,
    pressedAt: 0,
    startEnable: false,
    inspectionTimer: 15,
    inspectionActive: false,
    yellowTimer: false,
    greenInspectionTimer: false,
    clickInspectionColor: false,
    clicked: false
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
    isSolving() {
      return this.$store.state.isSolving;
    },
    timerColor() {
      if (this.clickStart && this.inspectionEnabled && this.clicked) {
        if (this.isSolving) {
          if (this.inspectionActive && !this.clickInspectionColor) {
            return "red-timer";
          }
          if (this.clickInspectionColor) {
            return "inspection-click-color";
          }
        }
      }
      if (this.greenTimer && !this.inspectionEnabled) {
        return "timer-color";
      }
      if (this.isSolving) {
        if (this.inspectionEnabled) {
          if (this.inspectionActive && !this.yellowTimer) {
            return "red-timer";
          }
          if (this.yellowTimer && !this.greenInspectionTimer) {
            return "yellow-timer";
          }
          if (this.greenInspectionTimer) {
            return "green-timer";
          }
        }
      }
      return this.$vuetify.theme.dark ? "white-timer" : "black-timer";
    },
    inspectionEnabled() {
      return this.$store.state.inspectionTime;
    },
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
  watch: {
    inspectionTimer() {
      if (this.inspectionTimer === 0) {
        this.$store.commit("addTime", {
          baseTime: "DNF",
          time: "DNF",
          remove: null,
          plusTwo: false,
          dnf: true,
          session: this.$store.state.session,
          scramble: this.scramble,
          scrambleType: this.scrambleType
        });
        this.stopInspection();
        this.resetInspection();
        this.$store.commit("updateIsSolving", false);
      }
    }
  },
  methods: {
    mobileInputEnd() {
      this.clicked = false;
      if (this.inspectionEnabled) {
        this.clickInspectionColor = false;
        this.yellowTimer = false;
        this.$store.commit("updateIsSolving", true);
        if (
          !this.inspectionActive &&
          (this.currentTime === 0 || this.currentTime === this.lastTime)
        ) {
          this.startInspection();
        }
        if (
          (this.currentTime === 0 || this.currentTime === this.lastTime) &&
          Date.now() - this.pressedAt >= 400 &&
          this.inspectionTimer !== 15
        ) {
          this.startEnable = true;
          this.stopInspection();
          this.resetInspection();
          this.pressedAt = 0;
          this.onSpacebar();
        }
        if (this.inspectionActive && !this.startEnable) {
          return;
        }
        if (this.inspectionTimer !== 15) {
          this.stopInspection();
        }
        if (this.currentTime !== 0) {
          this.onSpacebar();
        } else {
          this.greenTimer = false;
          this.reset();
        }
      } else {
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
          this.reset();
        }
      }
    },
    onTouchStart(event) {
      if (this.clickStart) {
        if (event.type === "touchstart") {
          event.preventDefault();
          this.clicked = true;
          this.pressedAt = Date.now();
          if (this.resetTime) {
            this.greenTimer = true;
          }
          if (this.inspectionActive) {
            this.clickInspectionColor = true;
          }
        }
      }
    },
    onTouchEnd(event) {
      if (this.clickStart) {
        if (event.type === "touchend") {
          this.mobileInputEnd();
        }
      }
    },
    onMouseDown(event) {
      if (this.clickStart) {
        if (event.type === "mousedown") {
          event.preventDefault();
          this.clicked = true;
          this.pressedAt = Date.now();
          if (this.resetTime) {
            this.greenTimer = true;
          }
          if (this.inspectionActive) {
            this.clickInspectionColor = true;
          }
        }
      }
    },
    onMouseUp(event) {
      if (this.clickStart) {
        if (event.type === "mouseup") {
          this.mobileInputEnd();
        }
      }
    },
    onKeyDown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        if (this.pressedAt === 0) {
          this.pressedAt = Date.now();
        }
        if (this.inspectionActive) {
          this.yellowTimer = true;
          if (Date.now() - this.pressedAt >= this.timeStep) {
            this.startEnable = true;
            this.greenInspectionTimer = true;
            this.pressedAt = 0;
          }
        } else if (!this.inspectionEnabled) {
          if (Date.now() - this.pressedAt >= this.timeStep) {
            this.startEnable = true;
            this.pressedAt = 0;
          }
        }
        if (this.resetTime) {
          this.greenTimer = true;
        }
      }
    },
    onKeyUp(event) {
      if (event.code === "Space") {
        this.pressedAt = 0;
        this.yellowTimer = false;
        this.greenInspectionTimer = false;
        if (this.inspectionEnabled) {
          this.$store.commit("updateIsSolving", true);
          if (this.inspectionActive && !this.startEnable) {
            return;
          }
          if (!this.inspectionActive) {
            this.startInspection();
          }
          if (this.inspectionTimer !== 15) {
            this.stopInspection();
            this.onSpacebar();
          }
        } else {
          this.onSpacebar();
        }
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
        this.resetInspection();
      } else {
        this.greenTimer = false;
        this.resetTime = true;
        this.resetInspection();
      }
    },
    start() {
      this.timerId = setInterval(() => {
        this.currentTime += 10;
      }, 10);
    },
    stop() {
      clearInterval(this.timerId);
    },
    reset() {
      this.currentTime = 0;
    },
    startInspection() {
      this.inspectionActive = true;
      this.inspectionId = setInterval(() => {
        this.inspectionTimer -= 1;
      }, 1000);
    },
    stopInspection() {
      clearInterval(this.inspectionId);
      this.inspectionActive = false;
    },
    resetInspection() {
      this.inspectionTimer = 15;
    },
    newScramble() {
      let newScramble;
      if (this.scrambleType === "3x3") {
        newScramble = this.generateScramble(20);
      } else if (this.scrambleType === "2x2") {
        newScramble = this.generateScramble(9);
      } else if (this.scrambleType === "4x4") {
        newScramble = this.generateBigScramble(40);
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
        if (length === 40) {
          if (["R", "U", "F"].includes(move)) {
            result.push(move + append[Math.floor(Math.random() * 6)]);
          } else {
            result.push(
              move + append.slice(0, 4)[Math.floor(Math.random() * 3)]
            );
          }
        } else result.push(move + append[Math.floor(Math.random() * 6)]);
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
.black-timer {
  color: #000000;
}
.white-timer {
  color: #ffffff;
}
.red-timer {
  color: #ff1744;
}
.green-timer {
  color: #00c853 !important;
}
.yellow-timer {
  color: #ffc400;
}
.inspection-click-color {
  animation-name: inspection-color-change;
  animation-fill-mode: forwards;
  animation-duration: 400ms;
  animation-timing-function: step-end;
  color: #000;
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
@keyframes inspection-color-change {
  0% {
    color: #ffc400;
  }
  100% {
    color: #00c853;
  }
}
</style>
