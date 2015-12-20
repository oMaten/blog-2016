var parse = require('co-body'),
	model = require('../model/users'),
  auth = require('./auth');

module.exports.listUsers = function* listUsers(){
	var users = yield model.listUsers();
	this.body = users;
}

module.exports.addUser = function* addUser(){
  var body = yield parse.json(this);

  // 检查信息是否完整
  if(!body.username || !body.password || !body.repassword){
    return this.throw('缺少用户名或密码', 401);
  }

  // 检查两次密码输入是否相同
  if(body.password !== body.repassword){
    return this.throw('输入的密码不相同', 401);
  }
  delete body.repassword;

  // 查询用户名是否已经存在
  var isExist = yield model.findUserByName(body.username);
  if(isExist){
    return this.throw('用户已经存在', 401);
  }
  // 将用户添加进数据库
  var user = yield model.addUser(body);

  var accessToken = yield auth.encryptFliter(user[0]);
  // 为用户添加token
  user = yield model.updateUser(user[0], accessToken);
  this.body = {
    accessToken: accessToken
  };
  this.status = 201;

}

module.exports.signinUser = function* signinUser(){
  var body = yield parse.json(this);

  // 判断用户名密码是否存在
  if(!body.password || !body.username){
    return this.throw('缺少用户名或密码', 401);
  }

  // 通过用户名查询用户信息
  var user = yield model.findUserByName(body.username);
  if(!user){
    return this.throw('用户不存在', 401);
  }

  // 验证用户密码是否正确
  var isValidate = yield model.passwordCompare(body, user.password);
  if(!isValidate){
    return this.throw('密码错误', 401);
  }

  this.body = {
    accessToken: user.token
  }
  this.status = 201;
}

module.exports.showUser = function* showUser(){

}

module.exports.updateUser = function* updateUser(){

}
