var parse = require('co-body'),
	model = require('../model/users');

module.exports.listUsers = function* listUsers(){
	var users = yield model.listUsers();
	this.body = users;
}

module.exports.addUser = function* addUser(){
  var body = yield parse.json(this);
  if(body.password !== body.repassword){
    this.body = {
      error: 'password wrong'
    };
  }
  delete body.repassword;
  var user = yield model.addUser(body);
  this.status = 200;
}

module.exports.showUser = function* showUser(){

}

module.exports.updateUser = function* updateUser(){

}
