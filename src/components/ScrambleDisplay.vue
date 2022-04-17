<template>
  <div class="scramble" :class="{ 'hide-display': hideDisplay }"></div>
</template>

<script>
import { ScrambleDisplay } from "scramble-display";
export default {
  name: "ScrambleDisplay",
  data() {
    return {
      scrambleMapping: {
        "2x2": "222",
        "3x3": "333",
        "4x4": "444",
        "5x5": "555",
        "6x6": "666",
        "7x7": "777",
        Clock: "clock",
        Megaminx: "minx",
        Pyraminx: "pyram",
        Skewb: "skewb",
        "Square-1": "sq1"
      }
    };
  },
  computed: {
    displaySize() {
      return this.$store.state.displaySize;
    },
    hideDisplay() {
      return this.$store.state.removeScrambleDisplay;
    },
    currentScramble() {
      return this.$store.state.currentScramble;
    },
    currentEvent() {
      return this.scrambleMapping[this.$store.state.scrambleType];
    },
    scrambleDisplay() {
      return this.getScrambleDisplay(
        this.currentScramble,
        this.currentEvent,
        this.displaySize
      );
    }
  },
  watch: {
    currentScramble() {
      const container = document.querySelector(".scramble");
      container.removeChild(container.lastElementChild);
      container.appendChild(this.scrambleDisplay);
    },
    displaySize() {
      const container = document.querySelector(".scramble");
      container.removeChild(container.lastElementChild);
      container.appendChild(this.scrambleDisplay);
    }
  },
  methods: {
    getScrambleDisplay(scramble, event, displaySize) {
      const scrambleDisplay = new ScrambleDisplay();
      scrambleDisplay.event = event;
      scrambleDisplay.scramble = scramble;
      scrambleDisplay.style.width = displaySize + "px";
      scrambleDisplay.style.height = displaySize / 1.5 + "px";
      return scrambleDisplay;
    }
  },
  mounted() {
    const container = document.querySelector(".scramble");
    container.appendChild(this.scrambleDisplay);
  }
};
</script>

<style scoped>
.hide-display {
  display: none;
}
</style>
