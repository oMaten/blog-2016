var koa = require('koa'),
	co = require('co'),
	server = require('koa-static'),
	view = require('koa-views'),
	router = require('koa-router'),
	db = require('./server/model/mongo');

var app = module.exports = koa();
var Router = module.exports = router();

co(function* (){
	yield db.connectDB();
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

app.listen(4010, function(){
	console.log('Server is connecting...');
});
