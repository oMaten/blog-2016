var parse = require('co-body'),
	PostModel = require('../model/posts'),
	FollowModel = require('../model/follow'),
	moment = require('moment');
	_ = require('lodash'),
	auth = require('./auth');

module.exports.listPosts = function* listPosts(next){
	var userIdList = [];
	var currentUserId;

	this.query.userId ? currentUserId = this.query.userId : currentUserId = this.loginUser._id;
	userIdList.push(currentUserId);

	if(this.query.getFollow){
		var userList = yield FollowModel.getFollowing(currentUserId, 0);
		_.forEach(userList, function(value, key){
			userIdList.push(value['_id']);
		});
	};

	if(this.query.q_post){
		var posts = yield PostModel.searchPosts(this.query.q_post);
	}else{
		var posts = yield PostModel.listPosts(userIdList);
	};

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
