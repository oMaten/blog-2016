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
  for(var i in u){
    if(!u[i]){
      return false;
    }
    user[i] = u[i];
  }
  isExist = yield findUser(user.username);
  if(isExist){
    return false;
  }
  user = yield passwordSalt(user);
  try{
    var result = yield mongo.users.insert(user);
  }catch(error){
    console.log(error);
    return false;
  }
  return result;
}

module.exports.findUser = function* (name){
  try{
    var user = yield mongo.users.findOne({username: name});
  }catch(error){
    console.log(error);
    return false;
  }
  return user;
}


var passwordSalt = function* (user){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return user;
}

var passwordCompare = function* (user, hash){

}
