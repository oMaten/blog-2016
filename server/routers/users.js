var Controller = require('../controllers/users'),
  Auth = require('../controllers/auth');

module.exports = function(Router){

	Router
		.get('/api/users', Controller.listUsers)
		.post('/api/users', Controller.addUser, Auth.encryptFliter)
		.get('/api/users/:userId', Controller.showUser, Auth.authFilter)
		.post('/api/users/:userId', Controller.updateUser)
    .post('/signin', Controller.signinUser, Auth.encryptFliter);
};
