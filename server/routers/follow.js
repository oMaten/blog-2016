var Controller = require('../controllers/follow'),
  Auth = require('../controllers/auth'),
  postsModel = require('../model/posts'),
  usersModel = require('../model/users'),
  followModel = require('../model/follow');

module.exports = function(Router){

  Router
    .get('/api/follow',
      Auth.authFilter,
      Controller.getFollow
    )
    .post('/api/follow',
      Auth.authFilter,
      Controller.addFollow
    )
    .post('/api/unfollow',
      Auth.authFilter,
      Controller.removeFollow
    )
};
