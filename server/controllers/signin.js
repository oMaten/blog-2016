module.exports = function(Router){
	var parse = require('co-body');

	Router
		.get('/', index)
		.post('/signin', signin)
		.post('/signup', signup);

	function* index(next){
		yield this.render('index.jade');
	}

	function* signin(next){
		var body = yield parse.json(this);
	}

	function* signup(next){
		var body = yield parse.json(this);
	}
};