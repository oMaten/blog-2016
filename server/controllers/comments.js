var parse = require('co-body'),
  PostModel = require('../model/posts'),
  CommentModel = require('../model/comments'),
  moment = require('moment');
  _ = require('lodash'),
  auth = require('./auth');

module.exports.listComments = function* listComments(next){
  var comments = yield CommentModel.listComments(this.params.postId);
  this.body = {
    'comments': comments
  };
  this.status = 200;
}

module.exports.createComment = function* createComment(next){
  var info = yield parse.json(this);
  var comment = yield CommentModel.createComment(info.postId, this.loginUser, info.content);
  comment.created = moment(comment.created).format('YYYY-MM-DD LT');
  this.body = {
    'comment': comment
  };
  this.status = 201;
}

module.exports.searchComments = function* searchComments(next){
  var queryItems = {};

  this.query.q_comment && (queryItems['content'] = this.query.q_comment);
  this.query.q_username && (queryItems['user.user_username'] = this.query.q_username);

  var comments = yield CommentModel.searchComments(queryItems);

  this.body = {
    'comments': comments
  };

  this.status = 201;
}

module.exports.deleteComment = function* deleteComment(next){
  if(!this.loginUser.admin){ return this.throw('没有权限', 401) };
  var result = yield CommentModel.deleteComment(this.query.id);
  this.body = {
    'result': result ? true : false
  }
  this.status = 201;
}
