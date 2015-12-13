var parse = require('co-body'),
	model = require('../model/posts');

module.exports.listPosts = function* listPosts(){
	var posts = yield model.listPosts();
	this.body = posts;
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
	var post = yield model.getPost(this.params.postId);
	this.body = post;
}

module.exports.listComments = function* listComments(){

}

module.exports.createComment = function* createComment(){

}
