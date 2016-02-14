angular.module('blog.controller.user', [
    'blog.server',
    'angular-storage',
    'angular-jwt'
  ])
  .controller('MineCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'Users', 'Follow', 'jwtHelper', 'store', function($scope, $rootScope, $stateParams, $state, Users, Follow, jwtHelper, store){
    $scope.followStatus = {
      'text': '关注',
      'status': false
    };
    Users
      .get({userId: $rootScope.userId})
      .$promise
      .then(function(data){
        $scope.user = data.user;
        console.log($scope.user);
      }, function(error){
        console.log(error);
      });
    Follow
      .list({userId: $rootScope.userId})
      .$promise
      .then(function(data){
        if(data.result){
          $scope.followStatus.text = '已关注';
          $scope.followStatus.status = true;
        }
      }, function(error){
        console.log(error);
      });

    $scope.toFollowing = function(){
      if($scope.followStatus.status){
        Follow
          .unfollow({userId: $rootScope.userId})
          .$promise
          .then(function(data){
            if(data.result){
              $scope.followStatus.text = '关注';
              $scope.followStatus.status = false;
            }
          });
        return;
      }

      Follow
        .follow({userId: $rootScope.userId})
        .$promise
        .then(function(data){
          if(data.result){
            $scope.followStatus.text = '已关注';
            $scope.followStatus.status = true;
          }
        }, function(error){
          console.log(error);
        });
    }
  }])
  .controller('UserCtrl', ['$scope', '$rootScope', '$stateParams', 'Users', 'jwtHelper', 'store', function($scope, $rootScope, $stateParams, Users, jwtHelper, store){
    Users
      .get({userId: $stateParams.id})
      .$promise
      .then(function(data){
        $scope.user = data.user;
      }, function(error){
        console.log(error);
      });
  }])
  .controller('UsersListCtrl', ['$scope', '$rootScope', '$window', 'Users', 'jwtHelper', 'store', function($scope, $rootScope, $window, Users, jwtHelper, store){
    Users
      .list()
      .$promise
      .then(function(data){
        $scope.users = data.users;
      }, function(error){
        console.log(error);
      });
  }])
  .controller('HomeCtrl', ['$scope', '$rootScope', '$stateParams', 'Posts', 'Comments', function($scope, $rootScope, $stateParams, Posts, Comments){
    Posts
      .get({userId: $rootScope.userId, getFollow: true})
      .$promise
      .then(function(data){
        $scope.$broadcast('gotPosts', data.posts);
      }, function(error){
        console.log(error);
      });

    $scope.$on('fetchComments', function(event, data){
      Comments
        .get({postId: data})
        .$promise
        .then(function(data){
          $scope.$broadcast('gotComments', data.comments)
        }, function(error){
          console.log(error);
        });
    });
    $scope.$on('createComment', function(event, data){
      Comments
        .save(data)
        .$promise
        .then(function(data){
          $scope.$broadcast('gotCommentOne', data.comment);
        }, function(error){
          console.log(error);
        });
    });
  }])
  .controller('PostItemCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.$on('gotPosts', function(event, data){
      $scope.posts = data;
    });
  }])
  .controller('CommentItemCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

    $scope.fetchComments = function(post){
      $scope.$emit('fetchComments', post._id);
      var gotComments = $scope.$on('gotComments', function(event, data){
        post.comments = data;
        // deregister the listener
        gotComments();
      });
    }

    $scope.createComment = function(post){
      if(!$scope.newComment.content){ return }
      $scope.newComment.postId = post._id;
      $scope.$emit('createComment', $scope.newComment);
      var gotCommentOne = $scope.$on('gotCommentOne', function(event, data){
        post.comments.unshift(data);
        // deregister the listener
        gotCommentOne();
      });
      $scope.newComment = {};
    }
  }]);
