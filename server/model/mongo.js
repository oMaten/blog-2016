var mongo = require('mongodb'),
  connect = mongo.connect;

module.exports = mongo;

mongo.connect = function* (){
  if(mongo.db){
    yield mongo.db.close();
  }

  var db = mongo.db = yield connect('mongodb://127.0.0.1:27017/blog');

  if(db){
    console.log('mongodb has already connect...');
  }

  mongo.posts = db.collection('posts');
  mongo.users = db.collection('users');
  mongo.follow = db.collection('follow');
  mongo.comments = db.collection('comments');
  mongo.like = db.collection('like');
}
