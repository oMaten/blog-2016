angular.module('blog.controller.signin', ['blog.server'])
	.controller('SignupCtrl', ['$scope', '$rootScope', '$window', '$state', 'Users', function($scope, $rootScope, $window, $state, Users){
		$scope.signupAccount = {};
		$scope.signupValidate = function(){
			if(!$scope.signupAccount.username || !$scope.signupAccount.password || !$scope.signupAccount.repassword){
				return false;
			}
			if($scope.signupAccount.password !== $scope.signupAccount.repassword){
				return false;
			}
			Users
				.save($scope.signupAccount)
				.$promise
				.then(function(response){
					$rootScope.username = response.data.username;
					$window.localStorage.token = response.data.accessToken;
					$state.go('home');
				}, function(error){
					console.log(error.data);
				});
		};
	}])
	.controller('SigninCtrl', ['$scope', '$rootScope', '$window', '$http', '$state', function($scope, $rootScope, $window, $http, $state){
		$scope.signinAccount = {};
		$scope.signinValidate = function(){
			if(!$scope.signinAccount.username || !$scope.signinAccount.password){
				return false;
			}
			$http({
				method: 'POST',
				url: '/signin',
				data: $scope.signinAccount
			}).then(function(response){
				$rootScope.username = response.data.username;
				$window.localStorage.token = response.data.accessToken;
				$state.go('home');
			}, function(error){
				console.log(error.data);
			});
		}
	}]);
