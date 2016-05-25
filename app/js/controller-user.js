angular
  .module('blog.controller.user', [
    'blog.server',
    'angular-storage',
    'angular-jwt'
  ])
  // 获取当前用户状态
  .controller('MineCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'Users', 'Follow', 'jwtHelper', 'store', 'User',function($scope, $rootScope, $stateParams, $state, Users, Follow, jwtHelper, store, User){

    $scope.user = User.profile;
    $scope.auth = User.auth;

    $scope.followStatus = User.followStatus;
    $scope.search = {};
    // 获取当前用户
    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(event){

      $scope.user = User.profile;
      $scope.auth = User.auth;
      // deregister the listener
      gotCurrentUser();
    });
    // 获取当前用户的关系状态
    var gotCurrentFollowStatus = $scope.$on('User.fetchCurrentFollowStatus', function(event){
      $scope.followStatus = User.followStatus;
      // deregister the listener
      gotCurrentFollowStatus();
    });
    // 创建新的关系
    $scope.toFollowing = function(){
      if($scope.followStatus.status){
        User.unFollowCurrentUser();
      }else{
        User.followCurrentUser();
      }
    }
    $scope.goSearch = function(){
      if($scope.search.user){
        $state.go('allUsers', { 'q_username': $scope.search.user }, {reload: true, inherit: false});
      }
      if($scope.search.post){
        $state.go('home', { 'q_post': $scope.search.post, 'p': 1 }, {reload: true, inherit: false});
      }
      $scope.search = {};
    }

  }])
  // 用户主页
  .controller('HomeCtrl', ['$scope', '$rootScope', '$stateParams', '$timeout', 'Posts', 'Comments', '$state', 'User', 'Post', function($scope, $rootScope, $stateParams, $timeout, Posts, Comments, $state, User, Post){
    $scope.auth = User.auth;
    $scope.user = User.profile;
    $scope.current = $state.current.name;
    $scope.param = $state.params;
    // console.log($state);
    $scope.pageLocked = false;

    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(){
      $scope.auth = User.auth;
      $scope.user = User.profile;
      gotCurrentUser();
    });

    // 翻页
    $scope.getNextPage = function(state){

      if($scope.pageLocked){ return };
      $scope.pageLocked = true;

      var currentPage = Math.ceil(Post.list.length / 10) + 1;
      var unLocked = $scope.$on('Post.fetchMorePosts', function(e, posts){
        if(posts.length != 0){
          $scope.pageLocked = false;
        }
        unLocked();
      });

      $timeout(function(){
        var nextparams = { 'p': currentPage };
        nextparams = angular.extend($scope.param, nextparams);

        Post.getMorePosts(nextparams);

      }, 1000);

    };
  }])
  // 获取文章列表以及添加文章
  .controller('PostItemCtrl', ['$scope', '$rootScope', '$timeout', 'Post', 'User', function($scope, $rootScope, $timeout, Post, User){
    $scope.posts = Post.list;
    $scope.newPost = {};
    $scope.loading = true;

    // 检查话题格式
    $scope.newPost.check = function(){
      if(this.content && this.content.match(/^\#/)){
        if(this.content.match(/^\#(\w|\W|\s)+\#/)){
          return { 'isUseTopic': false }
        }
        return { 'isUseTopic': true }
      }
    };
    // 获取文章
    var gotAllPosts = $scope.$on('Post.fetchAllPosts', function(){
      $scope.posts = Post.list;
      gotAllPosts();
    });

    // 加载文章
    var gotMorePosts = $scope.$on('Post.fetchMorePosts', function(e, posts){
      if(posts.length == 0){
        $scope.loading = false;
      }else{
        $scope.posts = $scope.posts.concat(posts);
      }
    });

    // 创建新文章
    $scope.createNewPost = function(newPost){
      if(!newPost.content){ return };
      newPost.topic = '#日常#';
      if(newPost.content.match(/^\#(\w|\W|\s)+\#/)){
        newPost.topic = newPost.content.match(/^\#((\w|\W|\s)+)\#/)[0];
        newPost.content = newPost.content.replace(/^\#(\w|\W|\s)+\#(\s*)/, '');
      }
      Post.addPost(newPost);
      $scope.newPost = {};
    };
    // 点赞
    $scope.addHot = function(post){
      if(post.isHoted){ return };
      User.addLike(post._id);
      post.hotCount++;
      post.hoted = true;
      post.isHoted = true;
    };
    // 展示评论
    $scope.showTheComment = function(post){
      post.readyShowComment = !post.readyShowComment;
      if(post.isShowComment){
        $timeout(function(){ post.isShowComment = !post.isShowComment }, 1000);
      }else{
        post.isShowComment = !post.isShowComment;
      }
    };
  }])
  // 获取评论以及添加评论
  .controller('CommentItemCtrl', ['$scope', '$rootScope', 'Post', function($scope, $rootScope, Post){
    // 获取评论
    $scope.fetchComments = function(post){
      Post.getPostAllComments(post);
    }
    // 创建新评论
    $scope.createComment = function(post){
      if(!$scope.newComment.content){ return };
      Post.createNewComment(post, $scope.newComment.content);
      $scope.newComment = {};
    }
  }])
  // 获取用户列表
  .controller('UserItemCtrl', ['$scope', '$rootScope', 'User', function($scope, $rootScope, User){
    var gotAllUserList = $scope.$on('User.fetchUsersList', function(){
      $scope.users = User.list;
      gotAllUserList();
    });
  }])
  // 获取用户个人信息
  .controller('InfoCtrl', ['$scope', '$rootScope', 'User', '$state', function($scope, $rootScope, User, $state){
    $scope.profile = User.profile;
    // 获取用户个人信息
    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(){
      $scope.profile = User.profile;
      gotCurrentUser();
    });
    // 更新用户个人信息
    $scope.updateUserProfile = function(){
      User.updateUser();
      $scope.$on('User.changeProfileSuccess', function(){
        $state.go('user', { "id": $scope.profile._id });
      });
    };
  }])
  // 修改密码
  .controller('PasswordCtrl', ['$scope', '$rootScope', '$state', 'User', 'store', function($scope, $rootScope, $state, User, store){
    $scope.profile = User.profile;
    // 修改密码
    $scope.updateUserPassword = function(){

      if($scope.profile.password != $scope.profile.repassword){
        $scope.profile.password = '';
        $scope.profile.repassword = '';
        alert('两次输入的密码不同！请再次输入');
        return;
      };

      User.changePassword();
      $scope.$on('User.changePasswordSuccess', function(){
        $rootScope.userId = null;
        store.get('accessToken') && store.remove('accessToken');
        $state.go('signin');
      });

    }
  }])
  // 图片上传
  .directive("fileread", ['$parse', function($parse){
    return {
      scope: {
        fileread: "=",
        fileload: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          scope.fileread = [];
          scope.fileload = [];
          var files = changeEvent.target.files;
          for(var i=0; i<files.length; i++){
            scope.$apply(function(){
              scope.fileload.push(files[i]);
            });
            var reader = new FileReader();
            reader.onload = function (e){
              scope.$apply(function(){
                scope.fileread.push(e.target.result);
              });
            }
            reader.readAsDataURL(files[i]);
          }
        });
      }
    }
  }])
  // 监听滑动翻页
  .directive("whenscrolled", function(){
    return {
      link: function(scope, element, attributes){
        element.bind('scroll', function (scrollEvent) {
          if(element[0].scrollTop + element[0].offsetHeight >= element[0].scrollHeight){
            scope.$apply(attributes.whenscrolled);
          }
        });
      }
    }
  });
