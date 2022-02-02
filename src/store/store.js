import Vue from "vue";
import Vuex from "vuex";
import dateFormat from "dateformat";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    times: [],
    timesS2: [],
    session: 1,
    currentScramble: "",
    hideAll: false,
    isSolving: false,
    removeChart: false,
    clickStart: false,
    chartWidth: 675,
    chartHeight: 300,
    timerSize: 14
  },
  mutations: {
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
      let times;
      if (payload.session === 1) {
        times = state.times;
      } else if (payload.session === 2) {
        times = state.timesS2;
      }
      times[payload.index - 1][payload.prop] = true;
    },
    dnf(state, payload) {
      let times;
      if (payload.session === 1) {
        times = state.times;
      } else if (payload.session === 2) {
        times = state.timesS2;
      }
      times[payload.index - 1].dnf = true;
      times[payload.index - 1].baseTime = "DNF";
      times[payload.index - 1].time = "DNF";
    },
    plusTwo(state, payload) {
      let times;
      if (payload.session === 1) {
        times = state.times;
      } else if (payload.session === 2) {
        times = state.timesS2;
      }
      const newBaseTime = times[payload.index - 1].baseTime + 2000;
      const format = newBaseTime > 60000 ? "M:ss:L" : "ss:L";
      const time = new Date(newBaseTime);
      const newTime = dateFormat(time, format);
      times[payload.index - 1].baseTime = newBaseTime;
      times[payload.index - 1].time = newTime;
    },
    addTime(state, payload) {
      if (payload.session === 1) {
        state.times.push(payload);
      } else if (payload.session === 2) {
        state.timesS2.push(payload);
      }
    },
    removeTime(state, payload) {
      if (payload.session === 1) {
        state.times = state.times.filter(item => item.name !== payload.index);
      } else if (payload.session === 2) {
        state.timesS2 = state.timesS2.filter(
          item => item.name !== payload.index
        );
      }
    },
    clearTimes(state, session) {
      if (session === 1) {
        state.times = [];
      } else if (session === 2) {
        state.timesS2 = [];
      }
    }
  }
});
