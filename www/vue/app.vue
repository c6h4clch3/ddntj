<template>
  <div class="base-canvas">
    <div class="connection-error" v-if="error">エラー: {{ errMsg }}</div>
    <div class="login-window" v-if="room === ''">
      ログインルーム: <input v-model="loginRoom" @keydown.enter="connect()"/>
    </div>
    <chatbox :yourname.sync="yourname" :systems="systems"
             :selected.sync="selectedSystem" :socketio="socketio" v-if="room !== ''"></chatbox>
  </div>
</template>
<script>
import chatbox from './components/chatbox/chatbox';
import dicebot from '../js/dicebot';
import io from 'socket.io-client';

let room = '';
if (location.search !== '') {
  const params = {};
  location.search.substr(1).split('&').forEach(function(element) {
    const kv = element.split('=');
    params[kv[0]] = kv[1];
  }, this);
  room = params.loginRoom;
}

export default {
  data() {
    return {
      loginRoom: room,
      room: '',
      yourname: '',
      systems: [],
      selectedSystem: 'DiceBot',
      error: false,
      errMsg: '',
      socketio: {}
    }
  },
  components: {
    chatbox
  },
  methods: {
    initName: function() {
      const defname = Math.floor(Math.random()*100) + "さん";
      this.yourname = defname
      this.socketio.emit('connected', defname);
    },
    connect() {
      this.error = false;
      this.socketio = io(`/room/${this.loginRoom}`);
      this.room = this.loginRoom;
      this.socketio.on('error', (err) => {
        console.error(err);
        this.error = true;
        this.errMsg = err;
        this.room = '';
        this.socketio = {};
      });
      dicebot.getsystems((systems) => {
        this.systems = systems;
      });
      this.initName();
    }
  },
  created: function() {
    if (this.loginRoom !== '') {
      this.connect();
    }
  }
}
</script>
<style>
.connection-error {
  background-color: #f3dddd;
  border: solid 1px #f34444;
  border-radius: 3px;
  color: #f34444;
  display: block;
  left: 0;
  margin: 10px;
  padding: 10px;
  position: relative;
  right: 0;
}

.base-canvas {
  bottom: 0;
  display: block;
  left: 0;
  margin-top: 40px;
  position: absolute;
  right: 0;
  top: 0;
}
</style>

