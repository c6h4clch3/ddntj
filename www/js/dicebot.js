'use strict';
import jsonp from 'jsonp';
var dicebot = dicebot || {};

dicebot.systems = [];

dicebot.getsystems = function(callback){
  if(!dicebot.systems.length){
    jsonp(
      'https://www2.taruki.com/bcdice-api/v1/systems?callback=',
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
