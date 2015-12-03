var parse = require('co-body');

module.exports.listPosts = function* listPosts(){
	var posts = [
		{
			title: 'first article',
			created: '15-12-01',
			tag: 'css',
			id: 0
		},
		{
			title: 'second article',
			created: '15-12-01',
			tag: 'javascript',
			id: 1
		},
		{
			title: 'third article',
			created: '15-12-01',
			tag: 'nodejs',
			id: 2
		}
	];
	this.body = posts;
}

module.exports.createPost = function* createPost(){

}

module.exports.showPost = function* showPost(){
	var posts = [
		{
			title: 'first article',
			created: '15-12-01',
			tag: 'css',
			id: 0
		},
		{
			title: 'second article',
			created: '15-12-01',
			tag: 'javascript',
			id: 1
		},
		{
			title: 'third article',
			created: '15-12-01',
			tag: 'nodejs',
			id: 2
		}
	];
	var post = posts[this.params.postId];
	this.body = post;
}

module.exports.listComments = function* listComments(){
	
}

module.exports.createComment = function* createComment(){
	
}
