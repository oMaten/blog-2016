var Controller = require('../controllers/users'),
  Auth = require('../controllers/auth'),
  postsModel = require('../model/posts'),
  usersModel = require('../model/users');

module.exports = function(Router){

	Router
		.get('/api/users',
      Controller.listUsers,
      usersModel.listUsers
    )
		.post('/api/users',
      Controller.addUser,
      usersModel.getUserByName,
      usersModel.addUser,
      Auth.encryptFliter
    )
		.get('/api/users/:userId',
      Controller.showUser,
      Auth.authFilter,
      usersModel.getUserById
    )
		.post('/api/users/:userId',
      Controller.updateUser
    )
    .post('/signin',
      Controller.signinUser,
      usersModel.getUserByName,
      usersModel.passwordCompare,
      Auth.encryptFliter
    );
};
