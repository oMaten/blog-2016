angular.module('blog.controller.signin', [
		'blog.server',
		'angular-storage'
	])
	.controller('SigninCtrl', ['$scope', '$rootScope', '$window', '$http', '$state', 'store', 'Users', function($scope, $rootScope, $window, $http, $state, store, Users){

		$scope.signupAccount = {};
		$scope.signinAccount = {};

		$scope.signupValidate = function(){
			console.log($scope.signupAccount);
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


		$scope.signinValidate = function(){
			if(!$scope.signinAccount.username || !$scope.signinAccount.password){
				return false;
			}
			$http({
				method: 'POST',
				url: '/signin',
				data: $scope.signinAccount
			}).then(function(response){
				store.set('accessToken', response.data.accessToken);
				$state.go('home');
			}, function(error){
				console.log(error.data);
			});
		}
	}])
	.controller('SignoutCtrl', ['$scope', '$rootScope', '$window', '$state', 'store', function($scope, $rootScope, $window, $state, store){
		$rootScope.userId = null;
		store.get('accessToken') && store.remove('accessToken');
		$state.go('signin');
	}])
