var koa = require('koa'),
	server = require('koa-static'),
	view = require('koa-views'),
	router = require('koa-router');

var app = module.exports = koa();
var Router = module.exports = router();

app
	.use(view('./views', {
		map: {
			html: 'jade'
		}
	}))
	.use(server('./app'))
	.use(Router.routes())
	.use(Router.allowedMethods());

require('./server/controllers/signin')(Router);
require('./server/controllers/posts')(Router);

app.listen(4010, function(){
	console.log('Server is connecting...');
});