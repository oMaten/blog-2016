var parse = require('co-body'),
	PostModel = require('../model/posts'),
	FollowModel = require('../model/follow'),
	UserModel = require('../model/users'),
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

	if(this.query.q_post || this.query.q_topic){
		var queryItems = {};
		this.query.q_post && (queryItems['content'] = this.query.q_post);
		this.query.q_topic && (queryItems['topic'] = this.query.q_topic);
		this.query.q_username && (queryItems['user.user_username'] = this.query.q_username);
		var posts = yield PostModel.searchPosts(queryItems);
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
	var info = JSON.parse(this.request.body.fields.post_content);
  var img = this.request.body.files.post_with_images;
  if(_.isArray(img)){
  	for(var i=0,l=img.length; i<l; i++){
  		info.images[i] = img[i].path.replace(/\D+blog\-2016\/app/i, '');
  	}
  }
  if(img && img.path){
  	info.images[0] = img.path.replace(/\D+blog\-2016\/app/i, '');
  }

	info.user_id = this.loginUser._id;
	info.user_username = this.loginUser.username;

	if(!this.loginUser.canPost){
		return this.throw('已被禁止发布微博，请联系管理员', 401);
	}
	var post = yield PostModel.createPost(info);
	yield UserModel.incUserItem(this.loginUser._id, 'postCount', 1);
	this.body = {
		'post': post
	}
	this.status = 200;
}

module.exports.deletePost = function* deletePost(next){
	if(!this.loginUser.admin){ return this.throw('没有权限', 401) };
	var result = yield PostModel.deletePost(this.query.id);
	this.body = {
    'result': result ? true : false
  }
  this.status = 201;
}
