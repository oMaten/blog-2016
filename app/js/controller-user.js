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
  .controller('HomeCtrl', ['$scope', '$rootScope', '$stateParams', 'Posts', function($scope, $rootScope, $stateParams, Posts){
    Posts
      .get({userId: $rootScope.userId, getFollow: true})
      .$promise
      .then(function(data){
        $scope.posts = data.posts;
        console.log($scope.posts);
      }, function(error){
        console.log(error.data);
      });
  }]);
