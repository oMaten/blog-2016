var jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  uuid = require('node-uuid');

/* 检查 JWT 的签名 */
module.exports.authFilter = function* (next){
  try{
    this.decoded = jwt.verify(this.header.accesstoken, 'hmjmf');
  }catch(error){
    return error;
  }
}

/* 生产一个新的 JWT */
module.exports.encryptFliter = function* (next){
  this.accessToken = jwt.sign({
    seed: Math.random(),
    userId: this.user._id,
    uuid: uuid.v1()
  }, 'hmjmf', {
    expiresInMinutes: 24*60
  });
}
