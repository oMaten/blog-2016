var mongo = require('./mongo'),
	ObjectID = mongo.ObjectID,
	_ = require('lodash'),
	DBRef = mongo.DBRef;

function Post(){
	this.content = '';
	this.user = '';
	this.hot = 0;
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
	var posts = yield mongo.posts
		.find(
			{
				'user.user_id': {$in: idList}
			},
			{
				'limit': 15,
				'sort': {
					'created': -1
				}
			}
		)
		.toArray();
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
	try{
		var result = yield mongo.posts.insert(post);
		return result['ops'][0];
	}catch(error){
		console.log(error);
	}
}
