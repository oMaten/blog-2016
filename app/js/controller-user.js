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
    $scope.search = {};
    // 获取当前用户
    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(event){
      $scope.user = User.profile;
      $scope.auth = User.auth;
      // deregister the listener
      gotCurrentUser();
    });
    // 获取当前用户的关系状态
    $scope.followStatus = User.followStatus;
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
        $state.go('home', { 'q_post': $scope.search.post }, {reload: true, inherit: false});
      }
      $scope.search = {};
    }

  }])
  // 用户主页
  .controller('HomeCtrl', ['$scope', '$rootScope', '$stateParams', 'Posts', 'Comments', '$state', 'User', function($scope, $rootScope, $stateParams, Posts, Comments, $state, User){
    $scope.auth = User.auth;
    $scope.current = $state.current.name;
    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(){
      $scope.auth = User.auth;
      gotCurrentUser();
    });
  }])
  // 获取文章列表以及添加文章
  .controller('PostItemCtrl', ['$scope', '$rootScope', '$timeout', 'Post', function($scope, $rootScope, $timeout, Post){
    $scope.posts = Post.list;
    $scope.newPost = {};
    // 获取文章
    var gotAllPosts = $scope.$on('Post.fetchAllPosts', function(){
      $scope.posts = Post.list;
      gotAllPosts();
    });
    // 创建新文章
    $scope.createNewPost = function(newPost){
      if(!newPost.content){ return }
      Post.addPost(newPost);
      $scope.newPost = {};
    };
    // 展示评论
    $scope.showTheComment = function(post){
      post.readyShowComment = !post.readyShowComment;
      if(post.isShowComment){
        $timeout(function(){ post.isShowComment = !post.isShowComment }, 1000);
      }else{
        post.isShowComment = !post.isShowComment;
      }
    }
  }])
  // 获取评论以及添加评论
  .controller('CommentItemCtrl', ['$scope', '$rootScope', 'Post', function($scope, $rootScope, Post){
    // 获取评论
    $scope.fetchComments = function(post){
      Post.getPostAllComments(post);
    }
    // 创建新评论
    $scope.createComment = function(post){
      if(!$scope.newComment.content){ return }
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
        // $state.go('home');
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
  }]);
