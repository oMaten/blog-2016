var Controller = require('../controllers/users');

module.exports = function(Router){

	Router
		.get('/api/users', Controller.listUsers)
		.post('/api/users', Controller.addUser)
		.get('/api/posts/:userId', Controller.showUser)
		.post('/api/posts/:userId', Controller.updateUser)
    .post('/signin', Controller.signinUser);
};
