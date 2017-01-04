/**
 * 实现html中可以include html文件功能
 * 请勿与其它html处理相关的loader共用，目前没有做兼容处理，仅仅是用于在html中载入html
 *
 * author: linyandi
 * date  : 2016-12-15
 *
 */
let fs = require ("fs");
let path = require ("path");
let loaderUtils = require ("loader-utils");
let hasToString = false;

module.exports = function (content) {

  this.cacheable && this.cacheable ();

  if (/module\.exports\s?=/.test(content)) {
    content = content.replace(/module\.exports\s?=\s?/, '').replace(/\\n/g, '').replace(/\\/g, '').replace(/";$/, '').replace(/^"/, '');
  } else {
    hasToString = true;
  }

  let reg = /#\{require\([^)]*\)\}/g;
  let regLeft = /#\{require\(/g;
  let regLast = /\)\}$/g
  let regOpt = /\{[^\}]*\}/g;
  let ObjectReg = new RegExp(/^\{[^\}]\}$/,"g");
  let temp = "";
  let regModule = /module\.exports\s*=\s*/g;

  let query = loaderUtils.parseQuery (this.query) || {root: "./src"};

  let source = content.replace (reg, function (match) {
    let filePath = "";
    let fileData = "";
    let res = match.replace (regLeft, "").replace (regLast, "");
    let option = res.match (regOpt) ? JSON.parse (res.match (regOpt)[0]) : null;
    let filePathStr = res.replace (regOpt, "").replace (",", "").replace (/"/g, "").replace (/\s/g, "");

    filePath = path.resolve (query.root, filePathStr);

    fileData = fs.readFileSync(filePath, {encoding: "utf-8"});

    for (key in option) {
      fileData = fileData.replace(new RegExp("#{" + key + "}","g"), option[key]);
    }

    return fileData;

  });
  if (!hasToString){
    return 'module.exports = ' + JSON.stringify(source) + ';';
  } else {
    return source;
  }
};