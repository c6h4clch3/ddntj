/*
 * 同じインタフェースで環境変数の有無で
 * ファイル保存/mongoDB保存を使い分けるための
 * ファイルマネジメントモジュール
 */
const fs = require('fs');
const mkdirp = require('mkdirp');
const dirname = require('path').dirname;

// 保存先
const src = '../files';

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
    recursiveWrite(`${src}${room}/chatLog.json`, content, callback);
  }
  getChatLog(room, callback) {
    fs.readFile(`${src}${room}/chatLog.json`, 'utf-8', callback);
  }
}

module.exports = function() {
  let module;
  if (!process.env.MONGODB_URI === undefined) {

  } else {

  }
}
