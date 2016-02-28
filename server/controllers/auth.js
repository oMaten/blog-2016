var jwt = require('jsonwebtoken'),
  parse = require('co-body'),
  _ = require('lodash'),
  bcrypt = require('bcrypt'),
  UserModel = require('../model/users'),
  uuid = require('node-uuid');

/**
 * 检查 JWT 的签名并检查用户相关权限
 * @param {String} this.header
 * @param {String} this.params
 * @return {Object} this.decoded
 **/

module.exports.authFilter = function* authFilter(next){
  try{
    this.decoded = jwt.verify(this.header.accesstoken, 'hmjmf');
    this.auth = {
      'isAdmin': false
    };
  }catch(error){
    return error;
  }
  if(this.params.userId){
    this.visitUser = yield UserModel.getUserById(this.params.userId);
    if(this.decoded.userId === this.params.userId){
      this.auth['isAdmin'] = true;
    }
  }
  this.loginUser = yield UserModel.getUserById(this.decoded.userId);
  yield next;
}

/**
 * 生产一个新的 JWT
 * @param {String} this.user
 * @return {String} this.accessToken
 **/

module.exports.encryptFliter = function* encryptFliter(next){
  this.accessToken = jwt.sign({
    seed: Math.random(),
    userId: this.user._id,
    uuid: uuid.v1()
  }, 'hmjmf', {
    expiresInMinutes: 24*60
  });
}
