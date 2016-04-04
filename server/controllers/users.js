var parse = require('co-body'),
	model = require('../model/users'),
  FollowModel = require('../model/follow'),
  auth = require('./auth'),
  moment = require('moment'),
  _ = require('lodash');

module.exports.listUsers = function* listUsers(){
  var userListId = [];
  if(this.query.getFollowing && this.query.userId){
    userListId = yield FollowModel.getFollowing(this.query.userId, 0);
  }
  if(this.query.getFollowed && this.query.userId){
    userListId = yield FollowModel.getFollowed(this.query.userId, 0);
  }

  if(_.isEmpty(this.query)){
    var users = yield model.listUsers();
  }else{
    if(this.query.q_username){
      var users = yield model.searchUserByName(this.query.q_username);
    }else{
      var users = yield model.listUsers(userListId);
    }
  }
  _.forEach(users, function(value, key){
    value['created'] = moment(value['created']).format('YYYY-MM-DD');
    value['profile']['dob'] = moment(value['profile']['dob']).format('YYYY-MM-DD');
  });

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
  this.visitUser.profile.dob = moment(this.visitUser.profile.dob).format('YYYY-MM-DD');
  this.body = {
    user: this.visitUser,
    auth: this.auth
  }
  this.status = 200;
}

module.exports.updateUser = function* updateUser(next){
  var info = yield parse.json(this);
  if(!this.loginUser.admin && info._id != this.loginUser._id){ return this.throw('没有权限', 401) };
  if(info.forbind){
    var result = yield model.setUserItem(info._id, 'canPost', false);
  }else{
    var result = yield model.updateUserProfile(this.loginUser._id, info.profile);
  }
  this.body = {
    'result': result ? true : false
  }
  this.status = 201;
}

module.exports.deleteUser = function* deleteUser(next){
  if(!this.loginUser.admin){ return this.throw('没有权限', 401) };
  if(this.query.id == this.loginUser._id){ return this.throw('不可删除自己', 401) };
  var result = yield model.deleteUser(this.query.id);
  this.body = {
    'result': result ? true : false
  }
  this.status = 201;
}
