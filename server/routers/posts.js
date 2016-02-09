var Controller = require('../controllers/posts'),
  Auth = require('../controllers/auth'),
  postsModel = require('../model/posts'),
  usersModel = require('../model/users');

module.exports = function(Router){

	Router
		.get('/api/posts',
      Controller.listPosts,
      Auth.authFilter,
      postsModel.listPosts
    )
		.post('/api/posts',
      Controller.createPost,
      Auth.authFilter,
      postsModel.createPost,
      usersModel.getUserById
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
