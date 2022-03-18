import Vue from "vue";
import Vuex from "vuex";
import dateFormat from "dateformat";

Vue.use(Vuex);

function getTimesArray(session) {
  return "times" + session;
}

export const store = new Vuex.Store({
  state: {
    times1: [],
    times2: [],
    times3: [],
    times4: [],
    times5: [],
    times6: [],
    times7: [],
    times8: [],
    times9: [],
    times10: [],
    session: 1,
    currentScramble: [],
    scrambleType: "3x3",
    hideAll: false,
    isSolving: false,
    removeChart: false,
    clickStart: false,
    inspectionTime: false,
    chartWidth: 675,
    chartHeight: 300,
    timerSize: 14
  },
  mutations: {
    updateInspectionTime(state, payload) {
      state.inspectionTime = payload;
    },
    updateScrambleType(state, payload) {
      state.scrambleType = payload;
    },
    updateTimerSize(state, payload) {
      state.timerSize = payload;
    },
    updateChartWidth(state, payload) {
      state.chartWidth = payload;
    },
    updateChartHeight(state, payload) {
      state.chartHeight = payload;
    },
    updateClickStart(state, payload) {
      state.clickStart = payload;
    },
    updateRemoveChart(state, payload) {
      state.removeChart = payload;
    },
    updateIsSolving(state, payload) {
      state.isSolving = payload;
    },
    updateHideAll(state, payload) {
      state.hideAll = payload;
    },
    newScramble(state, scramble) {
      state.currentScramble = scramble;
    },
    updateSession(state, currentSession) {
      state.session = currentSession;
    },
    buttonPressed(state, payload) {
      let current = getTimesArray(payload.session);
      let times = state[current];
      times[payload.index - 1][payload.prop] = true;
    },
    dnf(state, payload) {
      let current = getTimesArray(payload.session);
      let times = state[current];
      times[payload.index - 1].dnf = true;
      times[payload.index - 1].baseTime = "DNF";
      times[payload.index - 1].time = "DNF";
    },
    plusTwo(state, payload) {
      let current = getTimesArray(payload.session);
      let times = state[current];
      const newBaseTime = times[payload.index - 1].baseTime + 2000;
      const format = newBaseTime > 60000 ? "M:ss.L" : "s.L";
      const time = new Date(newBaseTime);
      const newTime = dateFormat(time, format);
      times[payload.index - 1].baseTime = newBaseTime;
      times[payload.index - 1].time = newTime;
    },
    addTime(state, payload) {
      let current = getTimesArray(payload.session);
      let times = state[current];
      times.push(payload);
    },
    removeTime(state, payload) {
      let current = getTimesArray(payload.session);
      state[current] = state[current].filter(
        item => item.name !== payload.index
      );
    },
    clearTimes(state, session) {
      let current = getTimesArray(session);
      state[current] = [];
    }
  }
});
