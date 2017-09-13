<template>
  <div class="base-canvas">
    <div class="connection-error" v-if="error">エラー: {{ errMsg }}</div>
    <div class="login-window" v-if="room === ''">
      <div class="login-window__info">ようこそ、どどんてぃへ!</div>
      ログインルーム: <input v-model="loginRoom" @keydown.enter="connect()"/>
    </div>
    <chatbox v-if="room !== ''"></chatbox>
    <map-canvas></map-canvas>
  </div>
</template>
<script>
import dicebot from '../js/dicebot';
import io from 'socket.io-client';
import { mapState, mapActions } from 'vuex';

import store from './store/store';
import chatbox from './components/chatbox/chatbox';
import mapCanvas from './components/map/map';

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
      error: false,
      errMsg: '',
    }
  },
  components: {
    chatbox,
    mapCanvas
  },
  computed: {
    ...mapState({
      socket: 'socket',
      room: 'room'
    }),
    ...mapState({
      name: state => state.player.name,
      systems: state => state.player.systems,
      selectedSystem: state => state.player.selectedSystem,
    })
  },
  store: store,
  methods: {
    initName: function() {
      this.initialize().then(() => {
        console.log(this.name);
        this.socket.emit('connected', this.name);
      });
    },
    connect() {
      this.error = false;
      this.updateRoom(this.loginRoom).then(() => {
        this.socket.on('error', (err) => {
          console.error(err);
          this.error = true;
          this.errMsg = err;
          this.updateRoom('');
        });
        this.initName();
      });
    },
    ...mapActions({
      initialize: 'player/initialize',
      updateRoom: 'room'
    })
  },
  created: function() {
    if (room !== '') {
      this.connect();
    }
  },
}
</script>
<style lang="scss">
@import url(https://fonts.googleapis.com/earlyaccess/notosansjp.css);
@import url(https://fonts.googleapis.com/earlyaccess/roundedmplus1c.css);

* {
  font-family: 'Rounded Mplus 1c';
}

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
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;

  .login-window {
    align-items: center;
    background-color: #eee;
    border: solid 1px #000;
    border-radius: 10px;
    bottom: 0;
    display: flex;
    height: 300px;
    justify-content: center;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 500px;

    .login-window__info {
      font-size: 24px;
      position: absolute;
      text-align: center;
      top: 10px;
    }
  }
}
</style>

