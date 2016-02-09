var mongo = require('./mongo'),
	ObjectID = mongo.ObjectID,
	DBRef = mongo.DBRef;

function Post(){
	this.content = '';
	this.user = '';
	this.created = new Date();
}

module.exports.getPostById = function* getPost(id){
	var post = yield mongo.posts.findOne({_id: ObjectID(id)}, {content: 1});
	return post;
}

/**
 * 查询所有微博
 * @param {Object} this.query.userId
 * @return {Array} this.posts
 **/

module.exports.listPosts = function* listPosts(next){
	if(this.query.userId){
		this.userId = this.query.userId;
		this.posts = yield mongo.posts
			.find(
				{
					'user.user_id': ObjectID(this.userId)
				},
				{},
				{
					'limit': 15,
					'sort': {
						'created': -1
					}
				}
			)
			.toArray();
		return;
	}
}

/**
 * 创建微博
 * @param {Object} this.decoded required
 * @param {Object} this.info required
 * @return {Object} this.post
 **/

module.exports.createPost = function* createPost(next){
	var post = new Post();
	this.userId = this.decoded.userId;
	post.content = this.info.content;
	// 查询创建微博的用户
	yield next;

	post.user = {
		'user_id': ObjectID(this.user._id),
		'user_username': this.user.username
	};

	try{
		var result = yield mongo.posts.insert(post);
		this.post = result['ops'][0];
	}catch(error){
		console.log(error);
	}
}
