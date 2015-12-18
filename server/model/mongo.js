var mongo = require('co-mongo');

module.exports = mongo;

mongo.connectDB = function* (){
	if(mongo.db){
		yield mongo.db.close();
	}

	var db = mongo.db = yield mongo.connect('mongodb://127.0.0.1:27017/blog');
	if(db){
		console.log('mongodb has already connect...');
	}

	mongo.posts = yield db.collection('posts');
	mongo.users = yield db.collection('users');
}
