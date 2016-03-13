var mongo = require('./mongo'),
	ObjectID = mongo.ObjectID,
	_ = require('lodash'),
	DBRef = mongo.DBRef;

function Post(){
	this.content = '';
	this.user = '';
	this.images = [];
	this.hotCount = 0;
	this.commentCount = 0;
	this.created = new Date();
}

module.exports.getPostById = function* getPost(id){
	var post = yield mongo.posts.findOne({_id: ObjectID(id)}, {content: 1});
	return post;
}

/**
 * 查询所有微博
 * @param {Object} id
 **/

module.exports.listPosts = function* listPosts(idList){
	_.forEach(idList, function(value, key){
		idList[key] = ObjectID(value)
	});
	var queryOpt = { 'user.user_id': { '$in': idList } };
	var limitOpt = { 'limit': 15, 'sort': { 'created': -1 } };
	var posts = yield mongo.posts.find(queryOpt, limitOpt).toArray();
	return posts;
}

/**
 * 通过内容搜索微博
 * @param {String} post
 **/

module.exports.searchPosts = function* searchPosts(post){
	var REG_EXP = new RegExp(post);
	var queryOpt = { 'content': REG_EXP };
	var limitOpt = { 'limit': 15, 'sort': { 'created': -1 } };
	var posts = yield mongo.posts.find(queryOpt, limitOpt).toArray();
	return posts;
}

/**
 * 创建微博
 * @param {Object} info
 **/

module.exports.createPost = function* createPost(info){
	var post = new Post();
	post.content = info.content;
	post.user = {
		'user_id': ObjectID(info.user_id),
		'user_username': info.user_username
	};
	post.images = info.images;
	try{
		var result = yield mongo.posts.insert(post);
		return result['ops'][0];
	}catch(error){
		console.log(error);
	}
}
