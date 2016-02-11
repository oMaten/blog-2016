var Controller = require('../controllers/posts'),
  Auth = require('../controllers/auth'),
  postsModel = require('../model/posts'),
  usersModel = require('../model/users');

module.exports = function(Router){

	Router
		.get('/api/posts',
      Auth.authFilter,
      Controller.listPosts
    )
		.post('/api/posts',
      Auth.authFilter,
      Controller.createPost
    )
		.get('/api/posts/:postId',
      Controller.showPost
    )
		.get('/api/posts/:postId/comments',
      Controller.listComments
    )
		.post('/api/posts/:postId/comments',
      Controller.createComment
    );
};
