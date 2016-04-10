var Controller = require('../controllers/posts'),
  Auth = require('../controllers/auth'),
  path = require('path'),
  koaBody = require('koa-better-body');

var srcPath = path.normalize(__dirname + '../../../app/img');

module.exports = function(Router){

	Router
		.get('/api/posts',
      Auth.authFilter,
      Controller.listPosts
    )
		.post('/api/posts',
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: srcPath
        }
      }),
      Auth.authFilter,
      Controller.createPost
    )
    .delete('/api/posts',
      Auth.authFilter,
      Controller.deletePost
    );
};
