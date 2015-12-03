var parse = require('co-body');

module.exports.index = function* index(){
	yield this.render('index.jade');
}

module.exports.signin = function* signin(){
	var body = yield parse.json(this);
}

module.exports.signup = function* signup(){
	var body = yield parse.json(this);
}
