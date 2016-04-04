var Controller = require('../controllers/posts'),
  Auth = require('../controllers/auth');

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
    .delete('/api/posts',
      Auth.authFilter,
      Controller.deletePost
    );
};
