var jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  uuid = require('node-uuid');

module.exports.authFilter = function* (body){
  try{
    var decoded = jwt.verify(body.accessToken, 'hmjmf');
  }catch(error){
    return this.throw(401, 'token错误');
  }
  console.log(decoded);
}

module.exports.encryptFliter = function* (user){
  var accessToken = jwt.sign({
    seed: Math.random(),
    username: user.username,
    id: user._id,
    uuid: uuid.v1()
  }, 'hmjmf', {
    expiresInMinutes: 24*60
  });
  return accessToken;
}
