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
