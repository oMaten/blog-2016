var mongo = require('./mongo'),
	ObjectID = mongo.ObjectID;

module.exports.getPostById = function* getPost(id){
	var post = yield mongo.posts.findOne({_id: ObjectID(id)}, {title: 1});
	return post;
}

module.exports.listPosts = function* listPosts(){
	var posts = yield mongo.posts.find({}, {}, {limit: 15, sort: {_id: -1}}).toArray();
	return posts;
}

module.exports.createPost = function* createPost(post){
	try{
		var result = yield mongo.posts.insert(post);
	}catch(error){
		console.log(error);
		return false;
	}
	return true;
}
