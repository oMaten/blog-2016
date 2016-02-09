var parse = require('co-body'),
	model = require('../model/users'),
  auth = require('./auth');

module.exports.listUsers = function* listUsers(next){
  yield next;
	this.body = {
    'users': this.users
  }
  this.status = 201;
}

module.exports.addUser = function* addUser(next){
  this.info = yield parse.json(this);

  // 检查信息是否完整
  if(!this.info.username || !this.info.password || !this.info.repassword){
    return this.throw('缺少用户名或密码', 401);
  }
  // 检查两次密码输入是否相同
  if(this.info.password !== this.info.repassword){
    return this.throw('输入的密码不相同', 401);
  }
  delete this.info.repassword;
  this.username = this.info.username;

  yield next;

  this.body = {
    accessToken: this.accessToken
  };
  this.status = 201;

}

module.exports.signinUser = function* signinUser(next){
  this.info = yield parse.json(this);

  // 检查信息是否完整
  if(!this.info.password || !this.info.username){
    return this.throw('缺少用户名或密码', 401);
  }

  this.username = this.info.username;
  this.password = this.info.password;
  // 通过用户名查询用户信息
  yield next;

  if(this.isCompare){
    return this.throw('密码错误', 401);
  }

  this.body = {
    accessToken: this.accessToken
  }
  this.status = 201;
}

module.exports.showUser = function* showUser(next){
  this.userId = this.params.userId;
  // 验证 JWT
  yield next;

  this.body = {
    user: this.user
  }
  this.status = 200;

}

module.exports.updateUser = function* updateUser(){

}
