var Controller = require('../controllers/signin')

module.exports = function(Router){

	Router
		.get('/', Controller.index)
		.post('/signin', Controller.signin)
		.post('/signup', Controller.signup);

};