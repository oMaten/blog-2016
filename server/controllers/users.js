var parse = require('co-body'),
	model = require('../model/users'),
  auth = require('./auth');

module.exports.listUsers = function* listUsers(){
  var users = yield model.listUsers();
	this.body = {
    'users': users
  }
  this.status = 201;
}

module.exports.addUser = function* addUser(next){
  var info = yield parse.json(this);
  // 检查信息是否完整
  if(!info.username || !info.password || !info.repassword){
    return this.throw('缺少用户名或密码', 401);
  }
  // 检查两次密码输入是否相同
  if(info.password !== info.repassword){
    return this.throw('输入的密码不相同', 401);
  }
  delete info.repassword;
  // 查询用户名是否已经存在
  var user = yield model.getUserByName(info.username);
  if(user){
    return this.throw('用户已经存在', 401);
  }
  this.user = yield model.addUser(info);
  yield next;
  this.body = {
    accessToken: this.accessToken
  };
  this.status = 201;
}

module.exports.signinUser = function* signinUser(next){
  var info = yield parse.json(this);
  // 检查信息是否完整
  if(!info.password || !info.username){
    return this.throw('缺少用户名或密码', 401);
  }
  // 通过用户名查询用户信息
  this.user = yield model.getUserByName(info.username);
  var isCurrent = yield model.passwordCompare(info.password, this.user.password);
  if(!isCurrent){
    return this.throw('密码错误', 401);
  }
  yield next;
  this.body = {
    accessToken: this.accessToken
  }
  this.status = 201;
}

module.exports.showUser = function* showUser(next){
  this.body = {
    user: this.visitUser,
    auth: this.auth
  }
  this.status = 200;
}

module.exports.updateUser = function* updateUser(){

}
