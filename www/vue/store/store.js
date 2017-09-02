import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';

import player from './modules/player';

Vue.use(Vuex);

const store = new Vuex.Store({
  state(){
    return {
      socket: {},
      room: ''
    }
  },
  actions: {
    room(context, room) {
      context.commit('room', room);
    }
  },
  mutations: {
    room(state, room) {
      if (typeof room !== 'string') {
        return;
      }
      state.room = room;
      if (typeof state.socket.disconnect === 'function') {
        state.socket.disconnect();
      }
      if (room === '') {
        state.socket = {};
      } else {
        state.socket = io.connect(`/room/${room}`);
      }
    }
  },
  modules: {
    player: player
  }
});

export default store;
