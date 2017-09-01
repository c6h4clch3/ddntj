import Vue from 'vue';
import Vuex from 'vuex';

import player from './modules/player';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    socketio: {}
  },
  modules: {
    player
  }
});
