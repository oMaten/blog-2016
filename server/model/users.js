var mongo = require('./mongo'),
  bcrypt = require('bcrypt'),
  ObjectID = mongo.ObjectID;

function User(){
  this.username = '';
  this.password;
  this.created = new Date;
}

module.exports.addUser = function* (u){
  var user = new User();
  // 查询User对象下的实例是否存在
  for(var i in u){
    if(!u[i]){
      return false;
    }
    user[i] = u[i];
  }

  // 将用户的密码hash加密
  user = yield passwordSalt(user);

  // 往数据库中添加User
  try{
    var result = yield mongo.users.insert(user);
  }catch(error){
    console.log(error);
    return false;
  }
  return result;
}

module.exports.findUserByName = function* (name){
  try{
    var user = yield mongo.users.findOne({username: name});
  }catch(error){
    console.log(error);
    return false;
  }
  return user;
}

module.exports.passwordCompare = function* (user, hash){
  var result = bcrypt.compareSync(user.password, hash);
  return result;
}

var passwordSalt = function* (user){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return user;
}
