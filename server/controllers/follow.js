var parse = require('co-body'),
  FollowModel = require('../model/follow'),
  UserModel = require('../model/users')
  auth = require('./auth');

module.exports.addFollow = function* addFollow(next){
  var info = yield parse.json(this);
  yield FollowModel.addFollow(this.loginUser._id, info.userId);
  yield UserModel.updateUserFollowCount(this.loginUser._id, 'followingCount', 1);
  yield UserModel.updateUserFollowCount(info.userId, 'followerCount', 1);
  this.body = {
    'result': true
  }
  this.status = 201;
}

module.exports.getFollowOne = function* getFollowOne(next){
  var follow_id = this.params.userId;
  var result = true;
  var follow = yield FollowModel.getFollow(this.loginUser._id, follow_id);
  if(!follow){
    result = false;
  }
  this.body = {
    'result': result
  }
  this.status = 200;
}

module.exports.getFollow = function* getFollow(next){
  var follow_id = this.query.userId;
  var result = true;
  var follow = yield FollowModel.getFollow(this.loginUser._id, follow_id);
  if(!follow){
    result = false;
  }
  this.body = {
    'result': result
  }
  this.status = 200;
}

module.exports.removeFollow = function* removeFollow(next){
  var info = yield parse.json(this);
  yield FollowModel.removeFollow(this.loginUser._id, info.userId);
  yield UserModel.updateUserFollowCount(this.loginUser._id, 'followingCount', -1);
  yield UserModel.updateUserFollowCount(info.userId, 'followerCount', -1);
  this.body = {
    'result': true
  }
  this.status = 201;
}
