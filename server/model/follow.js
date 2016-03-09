var mongo = require('./mongo'),
  ObjectID = mongo.ObjectID,
  DBRef = mongo.DBRef;

function Follow(){
  this.user_id = '';
  this.following_id = '';
  this.created = new Date;
}

/**
 * 通过用户 ID 添加关注
 * @param {Object} user_id
 * @param {Object} following_id
 **/

module.exports.addFollow = function* addFollow(user_id, following_id){
  var follow = new Follow();

  follow.user_id = ObjectID(user_id);
  follow.following_id = ObjectID(following_id);

  var result = yield mongo.follow.insert(follow);
  return result['ops'][0];
}

/**
 * 通过用户 ID 或被关注者 ID 查询关系
 * @param {String} user_id
 * @param {String} following_id
 **/

module.exports.getFollow = function* getFollow(user_id, following_id){
  var findItem = {};

  if(!user_id || !following_id){
    return this.throw('Missing Params', 401);
  }
  if(user_id == following_id){
    return this.throw('user_id can not equal following_id', 401);
  }

  findItem['user_id'] = ObjectID(user_id);
  findItem['following_id'] = ObjectID(following_id);

  var result = yield mongo.follow.findOne(findItem);
  return result;
}

/**
 * 通过用户 ID 获取其关注的用户的 ID
 * @param {String} user_id
 * @param {Int} count
 **/

module.exports.getFollowing = function* getFollowing(user_id, count){
  var count = count || 0;
  var cursor = yield mongo.follow
    .aggregate([
      {$match: {'user_id': ObjectID(user_id)}},
      {$project: {'_id': '$following_id'}},
      {$limit: 15},
      {$skip: count}
    ],
    {
      cursor: { batchSize: 15 }
    }).toArray();
  return cursor;
}

/**
 * 通过用户 ID 获取其粉丝的 ID
 * @param {String} user_id
 * @param {Array} count
 **/

module.exports.getFollowed = function* getFollowed(user_id, count){
  var count = count || 0;
  var cursor = yield mongo.follow
    .aggregate([
      {$match: {'following_id': ObjectID(user_id)}},
      {$project: {'_id': '$user_id'}},
      {$limit: 15},
      {$skip: count}
    ],
    {
      cursor: { batchSize: 15 }
    }).toArray();
  return cursor;
}


/**
 * 通过用户 ID 取消关注
 * @param {Object} user_id
 * @param {Object} following_id
 **/

module.exports.removeFollow = function* removeFollow(user_id, following_id){
  var result = yield mongo.follow
    .remove(
      {
        'user_id': ObjectID(user_id),
        'following_id': ObjectID(following_id)
      },
      {
        'justOne': true
      }
    );
  return result;
}
