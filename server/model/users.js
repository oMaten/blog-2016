var mongo = require('./mongo'),
  bcrypt = require('bcrypt'),
  ObjectID = mongo.ObjectID;

function User(){
  this.username = '';
  this.password;
  this.created = new Date;
  this.admin = false;
}

/* 添加用户 */

module.exports.addUser = function* (u){
  var user = new User();
  user.username = u.username;
  user.password = u.password;

  // 将用户的密码hash加密
  user = yield passwordSalt(user);

  // 往数据库中添加User
  try{
    var result = yield mongo.users.insert(user);
  }catch(error){
    console.log(error);
    return false;
  }
  return result[0];
}

/* 通过 ID 获取用户 */

module.exports.getUserById = function* (id){
  try{
    var user = yield mongo.users.findOne({_id: ObjectID(id)});
  }catch(error){
    console.log(error);
    return false;
  }
  return user;
}

/* 通过 UserName 获取用户 */

module.exports.getUserByName = function* (name){
  try{
    var user = yield mongo.users.findOne({username: name});
  }catch(error){
    console.log(error);
    return false;
  }
  return user;
}

/* 获取全部用户 */

module.exports.listUsers = function* listPosts(){
  var users = yield mongo.users.find({}, {}, {limit: 15, sort: {_id: -1}}).toArray();
  return users;
}

/*
module.exports.updateUser = function* (user, arg){
  try{
    var user = yield mongo.users.update(
      { _id: ObjectID(user._id) },
      {
        $set: {
          accessToken: arg
        }
      }
    );
  }catch(error){
    console.log(error);
    return false;
  }
  return user;
}
*/

module.exports.passwordCompare = function* (user, hash){
  var result = bcrypt.compareSync(user.password, hash);
  return result;
}

/* 辅助函数 */

var passwordSalt = function* (user){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return user;
}
