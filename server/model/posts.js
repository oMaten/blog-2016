var mongo = require('./mongo'),
	ObjectID = mongo.ObjectID,
	_ = require('lodash'),
	DBRef = mongo.DBRef;

function Post(){
	this.topic = '';
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
 * @param {Array} idList
 * @param {Int} page
 **/

module.exports.listPosts = function* listPosts(idList, page){
	_.forEach(idList, function(value, key){
		idList[key] = ObjectID(value)
	});
	var queryOpt = { 'user.user_id': { '$in': idList } };
	var sortOpt = { 'created': -1 };
	var skipOpt = ( page - 1 ) * 10;

	var posts = yield mongo.posts.find(queryOpt).sort(sortOpt).skip(skipOpt).limit(10).toArray();
	return posts;
}

/**
 * 通过内容搜索微博
 * @param {String} post
 * @param {Int} page
 **/

module.exports.searchPosts = function* searchPosts(queryOpt, page){
	_.forEach(queryOpt, function(value, key){
		queryOpt[key] = new RegExp(value);
	});
	var sortOpt = { 'created': -1 };
	var skipOpt = ( page - 1 ) * 10;
	var posts = yield mongo.posts.find(queryOpt).sort(sortOpt).skip(skipOpt).limit(10).toArray();
	return posts;
}

/**
 * 通过 ID 获取并增加微博文档
 * @param {String} id 微博
 * @param {String} key 文档键值
 * @param {String} value 键值取值
 **/

module.exports.incPostItem = function* incPostItem(id, key, value){
	var updateDoc = {};
  updateDoc[key] = value;
  yield mongo.posts.update({ "_id": ObjectID(id) }, { "$inc": updateDoc });
}

/**
 * 创建微博
 * @param {Object} info
 **/

module.exports.createPost = function* createPost(info){
	var post = new Post();
	post.content = info.content;
	post.topic = info.topic;
	post.user = {
		'user_id': ObjectID(info.user_id),
		'user_nickname': info.user_nickname,
		'user_face': info.user_face
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
