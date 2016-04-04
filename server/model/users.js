var mongo = require('./mongo'),
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  ObjectID = mongo.ObjectID,
  DBRef = mongo.DBRef;

function User(){
  this.username = '';
  this.password = '';
  this.profile = {
    'nickname': String(null),
    'face': String(null),
    'highline': String(null),
    'dob': new Date,
    'sex': Number(null),
    'age': Number(null)
  };
  this.created = new Date;
  this.followingCount = 0;
  this.followerCount = 0;
  this.postCount = 0;
  this.admin = false;
  this.canPost = true;
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
  var user = yield mongo.users.findOne({ '_id': ObjectID(id) });
  return user;
}

/**
 * 通过 UserName 获取用户
 * @param {String} username
 **/

module.exports.getUserByName = function* getUserByName(username){
  var user = yield mongo.users.findOne({ 'username': username });
  return user;
}

/**
 * 通过 UserName 查询用户
 * @param {String} username
 **/

module.exports.searchUserByName = function* getUserByName(username){
  var REG_EXP = new RegExp(username);
  var user = yield mongo.users.find({ 'username': REG_EXP }).toArray();
  return user;
}

/**
 * 获取全部用户
 * @param {Array} idList
 **/

module.exports.listUsers = function* listPosts(idList){
  var queryOpt = {},
    filterOpt = { 'password': 0 },
    limitOpt = { 'limit': 15, 'sort': { '_id': -1 } };
  if(idList){
    _.forEach(idList, function(value, key){
      idList[key] = ObjectID(value['_id']);
    });
    queryOpt = { '_id': { $in: idList } };
  }
  var users = yield mongo.users.find(queryOpt, filterOpt, limitOpt).toArray();

  return users;
}

/**
 * 通过 ID 获取并增加用户文档
 * @param {String} id 用户
 * @param {String} key 文档键值
 * @param {String} value 键值取值
 **/

module.exports.incUserItem = function* incUserItem(id, key, value){
  var updateDoc = {};
  updateDoc[key] = value;
  yield mongo.users.update({ "_id": ObjectID(id) }, { "$inc": updateDoc });
}

/**
 * 通过 ID 获取并更新用户文档
 * @param {String} id 用户
 * @param {String} key 文档键值
 * @param {String} value 键值取值
 **/

module.exports.setUserItem = function* setUserItem(id, key, value){
  var updateDoc = {};
  updateDoc[key] = value;
  var result = yield mongo.users.update({ "_id": ObjectID(id) }, { "$set": updateDoc });
  return result['result']['ok'];
}

/**
 * 更新用户信息
 * @param {Int} id 用户
 * @param {Object} profile 更新信息
 **/

module.exports.updateUserProfile = function* updateUserProfile(id, profile){
  var updateDoc = {};
  _.forEach(profile, function(value, key){
    updateDoc['profile.' + key] = value;
  });
  var result = yield mongo.users.update({ "_id": ObjectID(id) }, { "$set": updateDoc });
  return result['result']['ok'];
}

/**
 * 删除用户
 * @param {Int} id 用户
 */

module.exports.deleteUser = function* deleteUser(id){
  var result = yield mongo.users.remove({ "_id": ObjectID(id) });
  return result['result']['ok'];
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
