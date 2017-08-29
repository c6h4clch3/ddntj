<template>
  <div>
    <chatbox :yourname.sync="yourname" :systems="systems"
             :selected.sync="selectedSystem" :socketio="socketio" v-if="room !== ''"></chatbox>
    <div class="connection-error" v-if="error">コネクションエラー: 指定されたルームは存在しません</div>
  </div>
</template>
<script>
import chatbox from './components/chatbox/chatbox';
import dicebot from '../js/dicebot';
import io from 'socket.io-client';

const serverHost = location.host;
const protocol = location.protocol;
let room;
if (location.search !== '') {
  const params = {};
  location.search.substr(1).split('&').forEach(function(element) {
    const kv = element.split('=');
    params[kv[0]] = kv[1];
  }, this);
  room = params.loginRoom;
} else {
  room = 1;
}
let socketio = io.connect(`${protocol}//${serverHost}/room/${room}`);

export default {
  data() {
    return {
      room: room,
      yourname: '',
      systems: [],
      selectedSystem: 'DiceBot',
      error: false,
      socketio: socketio
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
  },
  created: function() {
    dicebot.getsystems((systems) => {
      this.systems = systems;
    });
    this.initName();
  }
}
</script>
<style>

</style>

