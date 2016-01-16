angular.module('blog.controller.user', [
    'blog.server',
    'angular-storage',
    'angular-jwt'
  ])
  .controller('UserCtrl', ['$scope', '$rootScope', '$window', 'Users', 'jwtHelper', 'store', function($scope, $rootScope, $window, Users, jwtHelper, store){

    Users
      .get({userId: $rootScope.userId})
      .$promise
      .then(function(data){
        $scope.user = data.user;
      }, function(error){
        console.log(error);
      });
  }]);
