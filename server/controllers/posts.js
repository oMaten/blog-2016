var parse = require('co-body'),
	model = require('../model/posts'),
	auth = require('./auth');

module.exports.listPosts = function* listPosts(){
	var posts = yield model.listPosts();
	if(this.request.header.accesstoken){
		var decoded = yield auth.authFilter(this.request.header.accesstoken);
		return this.body = {
			posts: posts,
			username: decoded.username
		}
	}
	return this.body = {
		posts: posts
	};
}

module.exports.createPost = function* createPost(){
	var body = yield parse.json(this);
	if(body){
		var done = yield model.createPost(body);
		if(done){
			this.status = 200;
		}
	}
}

module.exports.showPost = function* showPost(){
	var post = yield model.getPostById(this.params.postId);
	this.body = {
		post: post
	};
}

module.exports.listComments = function* listComments(){

}

module.exports.createComment = function* createComment(){

}
