var Controller = require('../controllers/users'),
  Auth = require('../controllers/auth'),
  postsModel = require('../model/posts'),
  usersModel = require('../model/users');

module.exports = function(Router){

	Router
		.get('/api/users',
      Auth.authFilter,
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
      Auth.authFilter,
      Controller.updateUser
    )
    .delete('/api/users',
      Auth.authFilter,
      Controller.deleteUser
    )
    .post('/signin',
      Controller.signinUser,
      Auth.encryptFliter
    );
};
