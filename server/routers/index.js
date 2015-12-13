var Controller = require('../controllers/index')

module.exports = function(Router){

	Router
		.get('/', Controller.index);

};
