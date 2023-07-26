/** @format */

const { log } = require("console");
var mongoose = require("mongoose");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const regexPattern = {
  a: "[a|ă|â|á|à|ạ|ả|ã|ẫ|ẩ|ắ|ặc|ằc|ấ|ầ|ậ|A|Ă|Â|Á|À|Ạ|Ả|Ã|Ẫ|Ẩ|Ắ|ẶC|ẰC|Ấ|Ầ|Ậ]{0,}",
  d: "[d|đ|Đ|D]{0,}",
  o: "[o|ò|ỏ|õ|ó|ọ|ồ|ổ|ỗ|ố|ộ|ơ|ờ|ở|ỡ|ớ|ợ|ö|õ|ő|ō|ŏ|ø|O|Ò|Ỏ|Õ|Ó|Õ|Ồ|Ổ|Ỗ|Ố|Ỗ|Ơ|Ờ|Ờ|Ỡ|Ớ|Ợ]{0,}",
  u: "[u|ù|ủ|ũ|ú|ụ|ư|ừ|ử|ữ|ứ|ự|û|ü|ű|ū|U|Ù|Ủ|Ũ|Ú|Ụ|Ư|Ừ|Ử|Ữ|Ứ|Ự|Ủ|Ũ|Ú|Ù]{0,}",
  y: "[y|ỳ|ỷ|ỹ|ý|ỵ|ŷ|ÿ|Y|Ỳ|Ỷ|Ỹ|Ý|Ỵ|Y|Ỹ]{0,}",
  e: "[e|è|ẻ|ẽ|é|ẹ|ê|ề|ể|ễ|ế|ệ|ë|ě|ę|æ|E|È|Ẻ|Ẽ|É|Ẹ|Ê|Ề|Ể|Ễ|Ế|Ệ]{0,}",
};

const getRegexPatternSearch = (str) => {
  if (!str || typeof str !== "string") return;
  str = str.trim().split("");
  let reg = "";

  for (let i = 0; i < str.length; i++) {
    const curChar = str[i];
    regexPattern[curChar]
      ? (reg += regexPattern[curChar])
      : (reg += `[${curChar}]`);
  }

  return reg;
};

const Response = (status = 200, message = "success", data = {}) => {
  return {
    status,
    message,
    data,
  };
};

const convertId = (id) => {
  if (!id) {
    return;
  }
  var newId = new mongoose.Types.ObjectId(id);
  return newId;
};

const convertManyId = (arr = []) => {
  let rs = [];
  if (arr.length == 0) {
    return [];
  }
  for (let i = 0; i < arr.length; i++) {
    rs.push(convertId(arr[i]));
  }
  return rs;
};

const generateToken = async (range = 12) => {
    const { stdout } = await exec(`openssl rand -hex ${range}`);
    return stdout.toLowerCase().trim();
}

module.exports = {
  getRegexPatternSearch,
  Response,
  convertId,
  convertManyId,
  generateToken
};
