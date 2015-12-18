var parse = require('co-body'),
	model = require('../model/users'),
  uid = require('uid-safe');

module.exports.listUsers = function* listUsers(){
	var users = yield model.listUsers();
	this.body = users;
}

module.exports.addUser = function* addUser(){
  var body = yield parse.json(this);

  // 检查信息是否完整
  if(!body.username || !body.password || !body.repassword){
    this.throw('缺少用户名或密码', 401);
    return false;
  }

  // 检查两次密码输入是否相同
  if(body.password !== body.repassword){
    this.throw('输入的密码不相同', 401);
    return false;
  }
  delete body.repassword;

  // 查询用户名是否已经存在
  var isExist = yield model.findUserByName(body.username);
  if(isExist){
    this.throw('用户已经存在', 401);
    return false;
  }
  // 将用户添加进数据库
  var user = yield model.addUser(body);

  var session_id = uid.sync(18);
  this.session.user = session_id;
  this.status = 200;
}

module.exports.signinUser = function* signinUser(){
  var body = yield parse.json(this);

  // 判断用户名密码是否存在
  if(!body.password || !body.username){
    this.throw('缺少用户名或密码', 401);
    return false;
  }

  // 通过用户名查询用户信息
  var user = yield model.findUserByName(body.username);
  if(!user){
    this.throw('用户不存在', 401);
    return false;
  }

  // 验证用户密码是否正确
  var isValidate = yield model.passwordCompare(body, user.password);
  if(!isValidate){
    this.throw('密码错误', 401);
    return false;
  }

  this.status = 200;
}

module.exports.showUser = function* showUser(){

}

module.exports.updateUser = function* updateUser(){

}
