var Controller = require('../controllers/users'),
  Auth = require('../controllers/auth'),
  path = require('path'),
  koaBody = require('koa-better-body');

var srcPath = path.normalize(__dirname + '../../../app/img');

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
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: srcPath
        }
      }),
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
