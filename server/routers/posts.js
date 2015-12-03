var Controller = require('../controllers/posts'); 

module.exports = function(Router){
	
	Router
		.get('/api/posts', Controller.listPosts)
		.post('/api/posts', Controller.createPost)
		.get('/api/posts/:postId', Controller.showPost)
		.get('/api/posts/:postId/comments', Controller.listComments)
		.post('/api/posts/:postId/comments', Controller.createComment);

};