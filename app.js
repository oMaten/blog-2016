var koa = require('koa'),
	co = require('co'),
	server = require('koa-static'),
	view = require('koa-views'),
	router = require('koa-router'),
	mongo = require('./server/model/mongo');

var app = koa();
var Router = module.exports = router();

co(function* (){
	yield mongo.connect();
});

app
	.use(view('./views', {
		map: {
			html: 'jade'
		}
	}))
	.use(server('./app'))
	.use(Router.routes())
	.use(Router.allowedMethods());

require('./server/routers/index')(Router);
require('./server/routers/posts')(Router);
require('./server/routers/users')(Router);
require('./server/routers/follow')(Router);
require('./server/routers/comments')(Router);
require('./server/routers/like')(Router);

app.listen(4011, function(){
	console.log('Server is connecting...');
});
