var mongo = require('./mongo'),
  ObjectID = mongo.ObjectID;

function Like(){
  this.user_id = '';
  this.post_id = '';
  this.created = new Date;
}
/**
 * 通过用户 ID & 微博 ID 添加点赞关系
 * @param {String} userId
 * @param {String} postId
 **/

module.exports.addLike = function* addLike(userId, postId){
  var like = new Like();
  like.user_id = ObjectID(userId);
  like.post_id = ObjectID(postId);

  var result = yield mongo.like.insert(like);
  return result['ops'][0];
}

/**
 * 通过用户 ID & 微博 ID 查询点赞关系
 * @param {String} userId
 * @param {String} postId
 **/

module.exports.getLike = function* getLike(userId, postId){
  var findItem = {};

  findItem['user_id'] = ObjectID(userId);
  findItem['post_id'] = ObjectID(postId);

  var like = yield mongo.like.findOne(findItem);
  return like;
}
