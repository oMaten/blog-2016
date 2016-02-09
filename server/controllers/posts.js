var parse = require('co-body'),
	model = require('../model/posts'),
	auth = require('./auth');

module.exports.listPosts = function* listPosts(next){

	// 验证JWT
	yield next;

	this.body = {
		'posts': this.posts
	};
	this.status = 200;
}

module.exports.createPost = function* createPost(next){

	this.info = yield parse.json(this);
	// 验证JWT
	yield next;

	this.body = {
		'post': this.post
	}
	this.status = 200;
}

module.exports.showPost = function* showPost(){
	var post = yield model.getPostById(this.params.postId);
	this.body = {
		'post': post
	};
}

module.exports.listComments = function* listComments(){

}

module.exports.createComment = function* createComment(next){
}
