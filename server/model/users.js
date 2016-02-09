var mongo = require('./mongo'),
  bcrypt = require('bcrypt'),
  _ = require('lodash'),
  ObjectID = mongo.ObjectID,
  DBRef = mongo.DBRef;

function User(){
  this.username = '';
  this.password = '';
  this.created = new Date;
  this.admin = false;
}

/**
 * 添加用户
 * @param {Object} this.req required
 * @return {Object} this.user
 **/

module.exports.addUser = function* addUser(next){
  var user = new User();

  // 查询用户名是否已经存在
  if(this.user){
    return this.throw('用户已经存在', 401);
  }
  user.username = this.info.username;
  user.password = this.info.password;
  // 将用户的密码hash加密
  user = yield passwordSalt(user);

  // 往数据库中添加User
  try{
    var result = yield mongo.users.insert(user);
    this.user = result['ops'][0];
  }catch(error){
    console.log(error);
    return false;
  }
  // 获取 JWT
  yield next;
}

/**
 * 通过 ID 获取用户
 * @param {String} this.userId required
 * @return {Object} this.user
 **/

module.exports.getUserById = function* getUserById(next){
  this.user = yield mongo.users
    .findOne(
      {
        '_id': ObjectID(this.userId)
      }
    );
  yield next;
}

/**
 * 通过 UserName 获取用户
 * @param {String} this.username required
 * @return {Object} this.user
 **/

module.exports.getUserByName = function* getUserByName(next){
  this.user = yield mongo.users
    .findOne(
      {
        username: this.username
      }
    );
  yield next;
}

/**
 * 获取全部用户
 * @return {Array} this.users
 **/

module.exports.listUsers = function* listPosts(next){
  this.users = yield mongo.users
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
  yield next;
}

/**
 * 通过 ID 获取用户并更新其文档中的微博文档引用
 * @param {String} this.userId required
 * @param {String} this.postId required
 * @return null
 **/

module.exports.updateUserPosts = function* updateUserPosts(next){
  try{
    yield mongo.users
    .update(
      {
        '_id': ObjectID(this.userId)
      },
      {
        $push: {
          'posts': new DBRef('posts', ObjectID(this.postId))
        }
      }
    );
    // 查询用户
    yield next;
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

module.exports.passwordCompare = function* passwordCompare(next){
  if(!this.user){
    return this.throw('用户不存在', 401);
  }
  this.isCompare = bcrypt.compareSync(this.user.password, this.password);
  yield next;
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
