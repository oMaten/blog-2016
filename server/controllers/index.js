var parse = require('co-body');

module.exports.index = function* index(){
	yield this.render('index.jade');
}
