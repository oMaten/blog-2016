var mongo = require('./mongo'),
  ObjectID = mongo.ObjectID,
  DBRef = mongo.DBRef,
  _ = require('lodash');

function Comment(){
  this.user = {};
  this.post_id = '';
  this.content = '';
  this.created = new Date;
}

/**
 * 通过用户 id 与微博 id 创建评论
 * @param {Object} user
 * @param {String} post_id
 * @param {String} content
 **/

module.exports.createComment = function* createComment(post_id, user, content){
  var comment = new Comment();
  comment.post_id = ObjectID(post_id);
  comment.user = {
    'user_id': ObjectID(user._id),
    'user_username': user.username
  }
  comment.content = content;

  var result = yield mongo.comments.insert(comment);
  return result['ops'][0];
}

/**
 * 通过微博 id 获取其所有评论
 * @param {String} post_id
 **/

module.exports.listComments = function* listComments(post_id){
  var queryOpt = { 'post_id': ObjectID(post_id) };
  var limitOpt = { 'limit': 15, 'sort': { 'created': -1 } };
  var comments = yield mongo.comments.find(queryOpt, limitOpt).toArray();
  return comments;
}

/**
 * 通过内容搜索评论
 * @param {String} comment
 **/

module.exports.searchComments = function* searchComments(queryOpt){

  _.forEach(queryOpt, function(value, key){
    queryOpt[key] = new RegExp(value);
  });

  var limitOpt = { 'limit': 15, 'sort': { 'created': -1 } };
  var comments = yield mongo.comments.find(queryOpt, limitOpt).toArray();
  return comments;
}

/**
 * 删除评论
 * @param {Int} id
 **/

module.exports.deleteComment = function* deleteComment(id){
  var result = yield mongo.comments.remove({ "_id": ObjectID(id) });
  return result['result']['ok'];
}

