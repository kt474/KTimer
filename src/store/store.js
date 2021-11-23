import Vue from "vue";
import Vuex from "vuex";

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
