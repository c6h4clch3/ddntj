<template>
  <div id="chatbox" class="chatbox" v-drag v-resize.all>
    <div id="chatmessages" @scroll="manageUpdateFlag()">
      <div class="spacer"></div>
      <div class="message"v-for="message in messages" v-cloak :key="message.id">{{message.text}}</div>
    </div>
    <div class="input-settings">
      <!-- 名前 -->
      <input
        :value="name"
        @input="event => { this.updateName(event.target.value); }"
      >
      <!-- システム選択 -->
      <select name="systems" size="1"
        :value="selectedSystem"
        @input="event => { this.updateSelectedSystem(event.target.value) }">
        <option selected></option>
        <option v-for="system in systems" :key="system">{{system}}</p></option>
      </select>
    </div>
    <div class="input-area">
      <textarea
        v-model="inputbox"
        @keydown.enter="sendMessage"
        placeholder="input message here"
        class="input-box"
      />
      <button
        @click="sendMessage"
        id="button"
        class="enter"
      >
      send Message
      </button>
    </div>
  </div>
</template>
<script>
import io from 'socket.io-client';
import Vue from 'vue';
import dragMixIn from '../../mixins/dragMixIn';
import resizeMixIn from '../../mixins/resizeMixIn';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      messages: [],
      totalMessageId: 0,
      inputbox: "",
      update: true,
    }
  },
  computed: {
    ...mapState('player', {
      name: 'name',
      systems: 'systems',
      selectedSystem: 'selectedSystem',
    }),
    ...mapState({
      socketio: 'socket'
    })
  },
  mixins: [
    dragMixIn,
    resizeMixIn
  ],
  created: function() {
    console.log(this.socketio);
    this.socketio.on("publish", (data) => {
      console.log(data);
      const text = data.text;
      console.log(text);
      this.addMessage.apply(this, [].concat(text));
    });
    this.socketio.on('connected', () => {
      this.addMessage("貴方は" + this.name + "として入室しました");
    });
    this.$nextTick(function() {
      // $('#chatbox').draggable().resizable({
      //   handles: "all",
      // });
    });
    return;
  },
  methods:{
    addMessage: function(...msgs){
      const messageBox = document.getElementById('chatmessages');
      msgs.forEach((msg) => {
        this.messages.push({
          id:(this.totalMessageId++),
          text:msg
        });
      });
      if (this.update) {
        this.$nextTick(function() {
          const messageBox = document.getElementById('chatmessages');
          messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight;
        });
      }
    },
    sendMessage: function(event){
      if (event.getModifierState('Shift')) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const textInput = this.inputbox;
      const name = this.name;
      const system = this.selectedSystem;

      if(textInput === ''){ return; }
      const _msg = "[" + name + "] " + textInput;
      this.socketio.emit(
        "publish",
        {
          'system': system,
          'text': textInput,
          'name': name
        }
      );
      this.inputbox = '';
    },
    manageUpdateFlag: function() {
      const messageBox = document.getElementById('chatmessages');
      if (messageBox.scrollTop === messageBox.scrollHeight - messageBox.clientHeight) {
        this.update = true;
      } else {
        this.update = false;
      }
    },
    ...mapActions({
      updateName: 'player/name',
      updateSelectedSystem: 'player/selectedSystem'
    })
  }
}
</script>
<style lang="scss">
#chatbox{
  align-items: flex-start;
  background-color: #eee;
  border: solid #808080;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  height: 150px;
  left: 10px;
  padding: 0.5em;
  position: absolute;
  width: 800px;
}

#chatmessages{
  background: #fff;
  display: flex;
  flex: 1 0 0px;
  flex-direction: column;
  font-size: 12px;
  margin: 0 0 5px;
  overflow-y: scroll;
  position: relative;
  white-space: pre-line;
  width: 100%;
}

.input-area {
  align-items: stretch;
  display: flex;
  flex: 0 0 auto;
  width: 100%;
}

.input-box {
  align-items: flex-start;
  display: flex;
  flex: 1 0 0px;
  height: 50px;
  padding: 0;
  resize: none;
}

.enter-button {
  flex: 0 0 auto;
}

.input-settings {
  flex: 0 0 auto;
  margin-bottom: 5px;
}

.message {
  flex: 0 0 auto;
}

.spacer {
  flex: 1 0 0px;
  max-height: 100%;
}
</style>

