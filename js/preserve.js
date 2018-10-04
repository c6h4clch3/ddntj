/*
 * 同じインタフェースで環境変数の有無で
 * ファイル保存/mongoDB保存を使い分けるための
 * ファイルマネジメントモジュール
 */
const fs = require('fs');
const mkdirp = require('mkdirp');
const dirname = require('path').dirname;

// 保存先
const src = 'files';

function recursiveWrite(path, content, callback) {
  mkdirp(dirname(path), function (err) {
    if (err) {
      return callback(err);
    }
    fs.writeFile(path, content, callback);
  })
}

class fileManager {
  constructor() {
    this.type = 'fileManager';
  }
  preserveChatLog(content, room, callback) {
    recursiveWrite(`${src}${room}/chatLog.json`, JSON.stringify(content, null, '  '), callback);
  }
  getChatLog(room, callback) {
    fs.readFile(`${src}${room}/chatLog.json`, 'utf-8', callback);
  }
  flushChatLog(room) {
    recursiveWrite(`${src}${room}/chatLog.json`, '', null);
  }
}

// if (!process.env.MONGODB_URI === undefined) {

// } else {

// }
module.exports = new fileManager();

