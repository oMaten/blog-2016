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
	this.created = new Date;
}
/**
 * 通过 Id 查询微博
 * @param {Object} id
 **/

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

module.exports.searchPosts = function* searchPosts(queryOpt){
	_.forEach(queryOpt, function(value, key){
		queryOpt[key] = new RegExp(value);
	});
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

/**
 * 删除微博
 * @param {Int} id
 **/

module.exports.deletePost = function* deletePost(id){
	var result = yield mongo.posts.remove({ "_id": ObjectID(id) });
  return result['result']['ok'];
}
