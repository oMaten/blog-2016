var Controller = require('../controllers/users'),
  Auth = require('../controllers/auth'),
  postsModel = require('../model/posts'),
  usersModel = require('../model/users');

module.exports = function(Router){

	Router
		.get('/api/users',
      Controller.listUsers
    )
		.post('/api/users',
      Controller.addUser,
      Auth.encryptFliter
    )
		.get('/api/users/:userId',
      Auth.authFilter,
      Controller.showUser
    )
		.post('/api/users/:userId',
      Controller.updateUser
    )
    .post('/signin',
      Controller.signinUser,
      Auth.encryptFliter
    );
};
