angular
  .module('blog.server', ['ngResource'])
	.factory('Posts', ['$resource', function($resource){
		return $resource('/api/posts/:postId',
      {},
      {
        'add': {method: 'POST', isArray: false, headers: {'Content-Type': undefined}, transformRequest: function(data, headersGetter){
          var formData = new FormData();
          formData.append('post_content', JSON.stringify(data));
          if(!data.images){ return formData };
          for(var i=0,l=data.images.length; i<l; i++){
            formData.append('post_with_images', data.images[i], data.images[i]['name']);
          }
          return formData;
        }},
        'list': {method: 'GET', isArray: false},
        'delete': {method: 'DELETE'}
      }
    );
	}])
	.factory('Comments', ['$resource', function($resource){
		return $resource('/api/posts/:postId/comments/:commentId',
      {
        'postId': '@postId'
      },
      {
        'search': {method: 'GET', isArray: false, url: '/api/comments'},
        'delete': {method: 'DELETE', url: '/api/comments'}
      }
    );
	}])
	.factory('Users', ['$resource', function($resource){
		return $resource('/api/users/:userId',
      {
        'userId': '@_id'
      },
      {
        'list': {method: 'GET', isArray: false},
        'findFollowMem': {method: 'GET', isArray: false, url: '/api/users'},
        'update': {method: 'POST', isArray: false, headers: {'Content-Type': undefined}, transformRequest: function(data, headersGetter){
          var formData = new FormData();
          formData.append('user_profile_face', data.profile.face[0], data.profile.face[0]['name']);
          formData.append('user_profile', JSON.stringify(data));
          return formData;
        }},
        'delete': {method: 'DELETE'},
        'addLike': {method: 'POST', isArray: false, url: '/api/like'},
        'forbind': {method: 'POST', isArray: false, url: '/api/users/:userId/forbind'}
      }
    );
	}])
  .factory('Follow', ['$resource', function($resource){
    return $resource('/api/follow/:userId',
      {},
      {
        'list': {method: 'GET', isArray: false},
        'follow': {method: 'POST', isArray: false},
        'unfollow': {method: 'POST', isArray: false, url: '/api/unfollow'}
      }
    );
  }])
  /**
   *  getUser 通过 userId 来获取用户信息并添加进 list
   *  getFollowStatus 获取当前用户的关注状态
   *  unFollowCurrentUser 取消关注当前对象
   *  followCurrentUser 关注当前对象
   **/
  .service('User', ['$rootScope', 'Users', 'Follow', function($rootScope, Users, Follow){
    var service = {
      list: [],
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
            console.log(data.user);
            if(data.user){
              ctx.profile = data.user;
              if(ctx.profile.profile.sex == 1){ ctx.profile.profile.sex = '女' };
              if(ctx.profile.profile.sex == 0){ ctx.profile.profile.sex = '男' };
            };
            if(data.auth){ ctx.auth = data.auth };
            $rootScope.$broadcast('User.fetchCurrentUser');
          }, function(error){
            console.log(error);
          });
      },
      updateUser: function(){
        var ctx = this;
        Users
          .update(ctx.profile)
          .$promise
          .then(function(data){
            if(!data.result){ alert('更新失败，请稍后再试~') };
            if(data.result){ $rootScope.$broadcast('User.changeProfileSuccess') };
          }, function(error){
            console.log(error);
          });
      },
      forbindUser: function(id, isForbind){
        var ctx = this;
        Users
          .forbind({'_id': id, 'forbind': isForbind})
          .$promise
          .then(function(data){
            console.log(data);
          }, function(error){
            console.log(error);
          });
      },
      getUsersList: function(formData){
        var ctx = this;
        Users
          .findFollowMem(formData)
          .$promise
          .then(function(data){
            data.users && (ctx.list = data.users);
            $rootScope.$broadcast('User.fetchUsersList');
          }, function(error){
            console.log(error);
          });
      },
      getFollowStatus: function(formData){
        var ctx = this;
        if(formData.userId == this.profile._id){ return }
        Follow
          .list(formData)
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
      },
      deleteUser: function(id){
        var ctx = this;
        Users
          .delete({'id': id})
          .$promise
          .then(function(data){
            console.log(data);
          }, function(error){
            console.log(error);
          });
      },
      addLike: function(id){
        var ctx = this;
        Users
          .addLike({'userId': ctx.profile._id, 'postId': id})
          .$promise
          .then(function(data){
            console.log(data);
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
          .add(formData)
          .$promise
          .then(function(res){
            console.log(res);
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
      },
      deletePost: function(id){
        var ctx = this;
        Posts
          .delete({'id': id})
          .$promise
          .then(function(data){
            console.log(data);
          }, function(error){
            console.log(error);
          });
      }
    }
    return service;
  }])
  .service('Comment', ['$rootScope', 'Comments', function($rootScope, Comments){
    var service = {
      list: [],
      getAllComments: function(formData){
        var ctx = this;
        Comments
          .search(formData)
          .$promise
          .then(function(data){
            ctx.list = data.comments;
            $rootScope.$broadcast('Comments.fetchAllComments');
          }, function(error){
            console.log(error);
          });
      },
      deleteComment: function(id){
        var ctx = this;
        Comments
          .delete({'id': id})
          .$promise
          .then(function(data){
            console.log(data);
          }, function(error){
            console.log(error);
          });
      }
    }
    return service;
  }]);
