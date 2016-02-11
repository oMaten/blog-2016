var mongo = require('./mongo'),
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  ObjectID = mongo.ObjectID,
  DBRef = mongo.DBRef;

function User(){
  this.username = '';
  this.password = '';
  this.created = new Date;
  this.followingCount = 0;
  this.followerCount = 0;
  this.admin = false;
}

/**
 * 添加用户
 * @param {Object} user
 **/

module.exports.addUser = function* addUser(info){
  var user = new User();
  user.username = info.username;
  user.password = info.password;
  // 将用户的密码hash加密
  user = yield passwordSalt(user);

  // 往数据库中添加User
  try{
    var result = yield mongo.users.insert(user);
    return result['ops'][0];
  }catch(error){
    console.log(error);
    return false;
  }
}

/**
 * 通过 ID 获取用户
 * @param {String} id
 **/

module.exports.getUserById = function* getUserById(id){
  var user = yield mongo.users
    .findOne(
      {
        '_id': ObjectID(id)
      }
    );
  return user;
}

/**
 * 通过 UserName 获取用户
 * @param {String} username
 **/

module.exports.getUserByName = function* getUserByName(username){
  var user = yield mongo.users
    .findOne(
      {
        'username': username
      }
    );
  return user;
}

/**
 * 获取全部用户
 **/

module.exports.listUsers = function* listPosts(){
  var users = yield mongo.users
    .find(
      {},
      {},
      {
        'limit': 15,
        'sort': {
          '_id': -1
        }
      }
    )
    .toArray();
  return users;
}

/**
 * 通过 ID 获取并更新用户文档
 * @param {String} id 用户
 * @param {String} key 文档键值
 * @param {String} value 键值取值
 **/

module.exports.updateUserFollowCount = function* updateUserFollowCount(id, key, value){
  var updateDoc = {};
  updateDoc[key] = value;
  try{
    yield mongo.users
    .update(
      {
        '_id': ObjectID(id)
      },
      {
        $inc: updateDoc
      }
    );
  }catch(error){
    console.log(error);
    return false;
  }
}

/**
 * 验证用户密码是否匹配
 * @param {String} this.password required
 * @param {Object} this.user required
 * @return {Boolean} this.isCompare
 **/

module.exports.passwordCompare = function* passwordCompare(hash, password){
  var isCurrent = bcrypt.compareSync(hash, password);
  return isCurrent;
}

/* 辅助函数 */

/**
 * hash 加密密码
 * @param {Object} user
 * @return {Object} user
 **/

var passwordSalt = function* passwordSalt(user){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return user;
}
