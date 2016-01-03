angular.module('blog.controller.signin', [
		'blog.server',
		'angular-storage'
	])
	.controller('SignupCtrl', ['$scope', '$rootScope', '$window', '$state', 'Users', 'store', function($scope, $rootScope, $window, $state, Users, store){
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
					store.set('accessToken', response.accessToken);
					$state.go('home');
				}, function(error){
					console.log(error.data);
				});
		};
	}])
	.controller('SigninCtrl', ['$scope', '$rootScope', '$window', '$http', '$state', 'store', function($scope, $rootScope, $window, $http, $state, store){
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
				store.set('accessToken', response.accessToken);
				$state.go('home');
			}, function(error){
				console.log(error.data);
			});
		}
	}]);
