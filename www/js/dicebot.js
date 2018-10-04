'use strict';
import jsonp from 'jsonp';
var dicebot = dicebot || {};

dicebot.systems = [];

dicebot.getsystems = function(callback){
  if(!dicebot.systems.length){
    jsonp(
      '/api/systems',
      null,
      function(err, data){
        if (err) {
          return err;
        }
        dicebot.systems = data.systems;
        callback(data.systems);
      }
    );
  }
}

export default dicebot;
