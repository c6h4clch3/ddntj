const express = require('express');
const app = express();

// OSSライブラリ群
var Log4js = require('log4js');
var $ = require('jquery');

// log4js設定
Log4js.configure('./js/config/log-config.json');
var systemLogger = Log4js.getLogger();

// 自作ライブラリ群
var constants = require('./js/constants.js').constants();
var dicebot = require('./js/dicebot.js').dicebot();
const preserve = require('./js/preserve.js');

// パブリックパス
const publicPath = './dist'

// サーバの初期化
var fs = require("fs");
const port = process.env.PORT || constants.LISTEN_PORT;
const server = app.listen(port, () => {
  systemLogger.info(`listening on *:${port}`);
});
app.use(express.static('dist'));
app.get('/', function(req, res, next) {
  const output = fs.readFileSync(publicPath + '/index.html', 'utf-8');
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  systemLogger.debug('return to Top page');
  res.end(output);
  return;
});
app.get('/api/systems', function(req, res, next) {
  const output = {
    systems: dicebot.systems
  }
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  systemLogger.debug('get systems');
  res.end(output);
});
// var server = require("http").createServer(
//   function(req, res) {
//     var requestpath =  req.url;
//     var output;
//     systemLogger.info(`request to ${requestpath}`);

//     if (requestpath === '/') {
//       // トップページ
//       res.writeHead(200, {"Content-Type":"text/html"});
//       output = fs.readFileSync(publicPath + '/index.html', "utf-8");
//       systemLogger.debug('return top page');
//       res.end(output);
//       return;
//     }
//     // 各種リソース
//     try{
//       requestpath = publicPath + requestpath;
//       if(requestpath.indexOf('/js/')>=0 || /.js$/.test(requestpath)){
//         // JS群
//         res.writeHead(200, {"Content-Type":"text/javascript"});
//       }else if(requestpath.indexOf('/css/images/')>=0){
//         res.writeHead(200, {"Content-Type":"image/png"});
//       }else if(requestpath.indexOf('/css/')>=0){
//         res.writeHead(200, {"Content-Type":"text/css"});
//       }
//       output = fs.readFileSync(requestpath, "utf-8");
//     } catch (err){
//       res.writeHead(404,{'Content-Type': 'text/plain'})
//       res.write(`the URL ${requestpath} is not found!`);
//       return res.end();
//     }
//     res.end(output);
//     return;
//   }
// ).listen(
//   process.env.PORT || constants.LISTEN_PORT,
//   () => {systemLogger.info(`listening on *:${constants.LISTEN_PORT}`);}
// )

class Log {
  constructor(room) {
    this.log = [];
    this.room = room;
  }
  push(msg) {
    this.log.push(msg);
    preserve.preserveChatLog({
      "main": this.log
    }, this.room, function(err) {
      if (err) {
        systemLogger.error(err);
      }
    });
  }
  read() {
    preserve.getChatLog(this.room, (err, data) => {
      if (err) {
        systemLogger.error(err);
        return;
      }
      this.log = JSON.parse(data).main;
    });
    return this;
  }
  flush() {
    this.log = [];
    preserve.flushChatLog(this.room);
  }
}

// socket.io イベント定義 (分割できないかな……)
var io = require("socket.io").listen(server);
const rooms = [];
for (var index = 1; index <= constants.ROOM_LIMIT; index++) {
  const room = io.of(`/room/${index}`);
  const rindex = index;
  const logger = new Log(room.name).read();
  // 接続開始カスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
  room.on("connection", function(socket) {
    socket.on('connected', function (name) {
      systemLogger.info(`connect : ${name} on Room ${room.name}`);
      socket.emit('publish', {'text': logger.log});
      var msg = name + "が入室しました";
      room.emit("publish", {'text': msg});
      logger.push(msg);
      socket.emit('connected');
    });
    // メッセージ送信カスタムイベント
    socket.on("publish", function (data) {
      var msg;
      systemLogger.info(`${data.name} : ${data.system} : ${data.text}`);
      dicebot.roll(
        function(res){
          systemLogger.debug(data.text);
          systemLogger.debug(res);
          if (res.secret && res.ok) {
            msg = `${data.name} : シークレットダイス`;
            room.emit('publish', { 'text': msg });
            logger.push(msg);
            msg = `シークレット(${data.system}) ${res.result}`;
            room.to(socket.id).emit('publish', {'text': msg});
            return;
          }
          msg = `${data.name} : ${data.text}`;
          room.emit("publish", {'text': msg});
          logger.push(msg);
          if(res.ok){
            msg = `(${data.system}) ${res.result}`;
            room.emit("publish", {'text': msg});
            logger.push(msg);
          }
        },
        data.system,
        data.text
      );
    });

    // 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
    socket.on("disconnect", function () {

    });
  });
  rooms.push(room);
}
