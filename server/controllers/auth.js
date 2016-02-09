var jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  uuid = require('node-uuid');

/**
 * 检查 JWT 的签名
 * @param {String} this.header.accesstoken required
 * @return {Object} this.decoded
 **/

module.exports.authFilter = function* (next){
  try{
    this.decoded = jwt.verify(this.header.accesstoken, 'hmjmf');
    yield next;
  }catch(error){
    return error;
  }
}

/**
 * 生产一个新的 JWT
 * @param {String} this.user required
 * @return {String} this.accessToken
 **/
module.exports.encryptFliter = function* (next){
  this.accessToken = jwt.sign({
    seed: Math.random(),
    userId: this.user._id,
    uuid: uuid.v1()
  }, 'hmjmf', {
    expiresInMinutes: 24*60
  });
}
