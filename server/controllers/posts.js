module.exports = function(Router){
	var parse = require('co-body');

	Router
		.get('/api/posts', listPosts)
		.post('/api/posts', createPost)
		.get('/api/posts/:postId', showPost)
		.get('/api/posts/:postId/comments', listComments)
		.post('/api/posts/:postId/comments', createComment);

	function* listPosts(next){
		var posts = [
			{
				title: 'first article',
				created: '15-12-01',
				tag: 'css',
				id: 1
			},
			{
				title: 'second article',
				created: '15-12-01',
				tag: 'javascript',
				id: 2
			},
			{
				title: 'third article',
				created: '15-12-01',
				tag: 'nodejs',
				id: 3
			}
		];
		this.body = posts;
	}

	function* createPost(next){

	}

	function* showPost(next){

	}

	function* listComments(next){

	}

	function* createComment(next){

	}
};