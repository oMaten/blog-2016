var parse = require('co-body'),
  PostModel = require('../model/posts'),
  UserModel = require('../model/users'),
  LikeModel = require('../model/like'),
  moment = require('moment');
  _ = require('lodash'),
  auth = require('./auth');

module.exports.getLike = function* listLike(next){

}

module.exports.createLike = function* createLike(next){
  var info = yield parse.json(this);
  var isExisted = yield LikeModel.getLike(this.loginUser._id, info.postId);
  if(isExisted){ return this.throw(200) };
  var result = yield LikeModel.addLike(this.loginUser._id, info.postId);
  yield PostModel.incPostItem(info.postId, 'hotCount', 1);
  this.body = {
    'result': result ? true : false
  };
  this.status = 201;
}
