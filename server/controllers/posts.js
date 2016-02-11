var parse = require('co-body'),
	PostModel = require('../model/posts'),
	FollowModel = require('../model/follow'),
	moment = require('moment');
	_ = require('lodash'),
	auth = require('./auth');

module.exports.listPosts = function* listPosts(next){
	var userIdList = [];
	userIdList.push(this.query.userId);
	if(this.query.getFollow){
		var userList = yield FollowModel.getFollowing(this.query.userId, 0);
		_.forEach(userList, function(value, key){
			userIdList.push(value['_id']);
		});
	}
	var posts = yield PostModel.listPosts(userIdList);
	_.forEach(posts, function(value, key){
		value['created'] = moment(value['created']).format('YYYY-MM-DD LT');
	});
	this.body = {
		'posts': posts
	};
	this.status = 200;
}

module.exports.createPost = function* createPost(next){
	var info = yield parse.json(this);
	info.user_id = this.loginUser._id;
	info.user_username = this.loginUser.username;
	var post = yield PostModel.createPost(info);
	this.body = {
		'post': post
	}
	this.status = 200;
}

module.exports.showPost = function* showPost(){
}

module.exports.listComments = function* listComments(){

}

module.exports.createComment = function* createComment(next){
}
