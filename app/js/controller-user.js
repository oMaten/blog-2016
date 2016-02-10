angular.module('blog.controller.user', [
    'blog.server',
    'angular-storage',
    'angular-jwt'
  ])
  .controller('MineCtrl', ['$scope', '$rootScope', '$stateParams', 'Users', 'jwtHelper', 'store', function($scope, $rootScope, $stateParams, Users, jwtHelper, store){
    Users
      .get({userId: $rootScope.userId})
      .$promise
      .then(function(data){
        $scope.user = data.user;
      }, function(error){
        console.log(error);
      });
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
  }]);
