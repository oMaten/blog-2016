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
    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(event){
      $scope.user = User.profile;
      $scope.auth = User.auth;
      // deregister the listener
      gotCurrentUser();
    });

    $scope.followStatus = User.followStatus;
    var gotCurrentFollowStatus = $scope.$on('User.fetchCurrentFollowStatus', function(event){
      $scope.followStatus = User.followStatus;
      // deregister the listener
      gotCurrentFollowStatus();
    });

    $scope.toFollowing = function(){
      if($scope.followStatus.status){
        User.unFollowCurrentUser();
      }else{
        User.followCurrentUser();
      }
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
    var gotAllPosts = $scope.$on('Post.fetchAllPosts', function(){
      $scope.posts = Post.list;
      gotAllPosts();
    });
    $scope.createNewPost = function(newPost){
      if(!newPost.content){ return }
      Post.addPost(newPost);
    };
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
    $scope.fetchComments = function(post){
      Post.getPostAllComments(post);
    }
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
    var gotCurrentUser = $scope.$on('User.fetchCurrentUser', function(){
      $scope.profile = User.profile;
      gotCurrentUser();
    });

    $scope.updateUserProfile = function(){
      User.updateUser();
      $scope.$on('User.changeProfileSuccess', function(){
        $state.go('home');
      });
    }
  }]);
