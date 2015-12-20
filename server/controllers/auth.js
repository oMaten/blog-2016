var jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  uuid = require('node-uuid');

module.exports.authFilter = function* (accessToken){
  try{
    var decoded = jwt.verify(accessToken, 'hmjmf');
  }catch(error){
    return this.throw('token错误', 401);
  }
  console.log(decoded);
  return decoded;
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
