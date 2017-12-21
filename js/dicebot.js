const BCDice = require('bcdice-js').BCDice;
const DiceBotLoader = require('bcdice-js').DiceBotLoader;
var Log4js = require('log4js');
const axios = require('axios');
// log4js設定
Log4js.configure('js/config/log-config.json');
var systemLogger = Log4js.getLogger();

const bcdice = new BCDice();
const dbLoader = new DiceBotLoader();

var https = require('https');
const BOTURL = 'https://www2.taruki.com/bcdice-api/v1/'
// http://www2.taruki.com/bcdice-api/v1/diceroll?system=Cthulhu&command=2d10>10

exports.dicebot = function(){

  const dicebots = DiceBotLoader.collectDiceBots();
  let systems = [];
  dicebots.forEach(function(elm) {
    this.push(elm._diceBot.$$class.$$name);
  }, systems);
  // function loadsystems() {
  //   let systems;
  //   systems = new Promise(resolve => {
  //     https.get(
  //       `${BOTURL}systems`,
  //       (res) => {
  //         let body = '';
  //         res.setEncoding('utf8');
  //         res.on('data', (chunk) => {
  //           body += chunk;
  //         });
  //         res.on('end', (res) => {
  //           _res = JSON.parse(body);
  //           systems = body.systems;
  //           resolve();
  //         })
  //       }
  //     );
  //   });
  //   return systems;
  // }

  var _dicebot = {

    systems : systems,

    roll : function(callback, system, command) {
      // var _command = encodeURIComponent(command);
      // var reqUrl = `${BOTURL}diceroll?system=${system}&command=${_command}`;
      // systemLogger.debug(`requrl : ${reqUrl}`);
      // https.get(
      //   reqUrl,
      //   (res)=>{
      //     var body='';
      //     res.setEncoding('utf8');
      //     res.on('data', (chunk) => {
      //       body += chunk;
      //     });
      //     res.on('end', (res) => {
      //       _res = JSON.parse(body);
      //       systemLogger.debug(_res);
      //       callback(_res);
      //     });
      //   }
      // );
      bcdice.setGameByTitle(system);
      bcdice.setMessage(command);
      const result = bcdice.diceCommand();
      let response = {};
      response.ok = result[0] !== '1';
      response.result = result[0];
      response.secret = result[1];
      callback(response);
    },

    systeminfo : function(callback, system){
      $.getJSON(
        'https://www2.taruki.com/bcdice-api/v1/systeminfo?callback=?',
        {
          'system': system
        }
      ).done(
        callback
      );
    },
  };
  return _dicebot;
}
