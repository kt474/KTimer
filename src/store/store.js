import Vue from "vue";
import Vuex from "vuex";
import dateFormat from "dateformat";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    times: [],
  },
  getters: {
    length: (state) => {
      return state.times.length;
    },
  },
  mutations: {
    buttonPressed(state, payload) {
      state.times[payload.index - 1][payload.prop] = true;
    },
    dnf(state, index) {
      state.times[index - 1].dnf = true;
      state.times[index - 1].baseTime = "DNF";
      state.times[index - 1].time = "DNF";
    },
    plusTwo(state, index) {
      let newBaseTime = state.times[index - 1].baseTime + 2000;
      let time = new Date(newBaseTime);
      let newTime = dateFormat(time, "ss:L");
      state.times[index - 1].baseTime = newBaseTime;
      state.times[index - 1].time = newTime;
    },
    addTime(state, time) {
      state.times.push(time);
    },
    removeTime(state, index) {
      state.times = state.times.filter((item) => item.name != index);
    },
    clearTimes(state) {
      state.times = [];
    },
  },
});
