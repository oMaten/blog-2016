var Controller = require('../controllers/like'),
  Auth = require('../controllers/auth');

module.exports = function(Router){

  Router
    .get('/api/like',
      Auth.authFilter,
      Controller.getLike
    )
    .post('/api/like',
      Auth.authFilter,
      Controller.createLike
    );
};
