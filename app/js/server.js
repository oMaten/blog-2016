angular
  .module('blog.server', ['ngResource'])
	.factory('Posts', ['$resource', function($resource){
		return $resource('/api/posts/:postId',
      {},
      {
        'list': {method: 'GET', isArray: false}
      }
    );
	}])
	.factory('Comments', ['$resource', function($resource){
		return $resource('/api/posts/:postId/comments/:commentId',
      {
        'postId': '@postId'
      }
    );
	}])
	.factory('Users', ['$resource', function($resource){
		return $resource('/api/users/:userId',
      {},
      {
        'list': {method: 'GET', isArray: false}
      }
    );
	}])
  .factory('Follow', ['$resource', function($resource){
    return $resource('/api/follow',
      {},
      {
        'list': {method: 'GET', isArray: false},
        'follow': {method: 'POST', isArray: false},
        'unfollow': {method: 'POST', isArray: false, url: '/api/unfollow'}
      }
    );
  }])
  /**
   *  getUser 通过 userId 来获取用户信息
   *  addUser 将获取的用户 data 赋值给当前的 profile 对象
   *  removeUser 清空当前 profile 对象中的值
   *  getFollowStatus 获取当前用户的关注状态
   *  unFollowCurrentUser 取消关注当前对象
   *  followCurrentUser 关注当前对象
   **/
  .service('User', ['$rootScope', 'Users', 'Follow', function($rootScope, Users, Follow){
    var service = {
      profile: {},
      auth: {},
      followStatus: {
        text: '关注',
        status: false
      },
      getUser: function(formData){
        var ctx = this;
        Users
          .get(formData)
          .$promise
          .then(function(data){
            ctx.addUser(data);
          }, function(error){
            console.log(error);
          });
      },
      addUser: function(data){
        this.removeUser();
        this.profile = data.user;
        this.auth = data.auth;
        $rootScope.$broadcast('User.fetchCurrentUser');
      },
      removeUser: function(){
        this.profile = {};
        this.auth = {};
      },
      getFollowStatus: function(){
        var ctx = this;
        Follow
          .list()
          .$promise
          .then(function(data){
            if(data.result){
              ctx.followStatus.text = '已关注';
              ctx.followStatus.status = true;
              $rootScope.$broadcast('User.fetchCurrentFollowStatus');
            }
          }, function(error){
            console.log(error);
          });
      },
      unFollowCurrentUser: function(){
        var ctx = this;
        Follow
          .unfollow({userId: ctx.profile._id})
          .$promise
          .then(function(data){
            if(data.result){
              ctx.profile.followerCount -= 1;
              ctx.followStatus.text = '关注';
              ctx.followStatus.status = false;
            }
          });
      },
      followCurrentUser: function(){
        var ctx = this;
        Follow
          .follow({userId: ctx.profile._id})
          .$promise
          .then(function(data){
            if(data.result){
              ctx.profile.followerCount += 1;
              ctx.followStatus.text = '已关注';
              ctx.followStatus.status = true;
            }
          }, function(error){
            console.log(error);
          });
      }
    }
    return service;
  }])
  /**
   *  getAllPosts 获取当前用户以及其关注对象的所有 Posts 并赋值给 list 对象
   *  addPost 添加 Post
   *  removeAllPosts 清空当前 list 对象中的值
   *  getPostAllComments 通过 postId 获取当前 Post 下的所有评论
   *  createNewComment 通过 postId 对当前 Post 添加评论
   **/
  .service('Post', ['$rootScope', 'Posts', 'Comments', function($rootScope, Posts, Comments){
    var service = {
      list: [],
      getAllPosts: function(formData){
        var ctx = this;
        ctx.removeAllPosts();
        Posts
          .get(formData)
          .$promise
          .then(function(data){
            ctx.list = data.posts;
            $rootScope.$broadcast('Post.fetchAllPosts');
          }, function(error){
            console.log(error);
          });
      },
      addPost: function(formData){
        var ctx = this;
        Posts
          .save(formData)
          .$promise
          .then(function(res){
            ctx.list.unshift(res.post);
          }, function(error){
            console.log(error.data);
          });
      },
      removeAllPosts: function(){
        this.list.length = 0;
      },
      getPostAllComments: function(post){
        Comments
          .get({postId: post._id})
          .$promise
          .then(function(data){
            post.comments = data.comments;
          }, function(error){
            console.log(error);
          });
      },
      createNewComment: function(post, comment){
        var formData = {'postId': post._id, 'content': comment};
        Comments
          .save(formData)
          .$promise
          .then(function(data){
            post.comments.unshift(data.comment);
          }, function(error){
            console.log(error);
          });
      }
    }
    return service;
  }]);
