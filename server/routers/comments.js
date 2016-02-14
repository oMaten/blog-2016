var Controller = require('../controllers/comments'),
  Auth = require('../controllers/auth');

module.exports = function(Router){

  Router
    .get('/api/posts/:postId/comments',
      Auth.authFilter,
      Controller.listComments
    )
    .post('/api/posts/:postId/comments',
      Auth.authFilter,
      Controller.createComment
    );
};
