angular.module('blog.controller', ['angular-jwt'])
	.controller('PostsListCtrl', ['$scope', '$rootScope', '$location', 'Posts', function($scope, $rootScope, $location, Posts){
		Posts
			.query()
			.$promise
			.then(function(posts){
				$scope.posts = posts;
			}, function(error){
				console.log(error.data);
			});
		$scope.newPost = {};
		$scope.createPost = function(){
			if($scope.newPost.title){
				Posts
					.save($scope.newPost)
					.$promise
					.then(function(post){
						console.log(post);
						$scope.newPost = {};
					}, function(error){
						console.log(error.data);
					});
			}
		};
	}])
	.controller('PostCtrl', ['$scope', '$rootScope', '$stateParams', 'Posts', function($scope, $rootScope, $stateParams, Posts){
		Posts
			.get({postId: $stateParams.id})
			.$promise
			.then(function(post){
				$scope.post = post;
			}, function(error){
				console.log(error.data);
			});
	}])
	.controller('SignupCtrl', ['$scope', '$rootScope', '$window', 'Users', 'jwtHelper', function($scope, $rootScope, $window, Users, jwtHelper){
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
				.then(function(data){
					// jwt解密取得username&userid
					var token = jwtHelper.decodeToken(data.accessToken);
					$window.localStorage.token = data.accessToken;
					$window.localStorage.username = token.username;
					$window.localStorage.id = token.id;
				}, function(error){
					console.log(error.data);
				});
		};
	}])
	.controller('SigninCtrl', ['$scope', '$rootScope', '$window', '$http', 'jwtHelper', function($scope, $rootScope, $http, $window, jwtHelper){
		$scope.signinAccount = {};
		$scope.signinValidate = function(){
			if(!$scope.signinAccount.username || !$scope.signinAccount.password){
				return false;
			}

			$http({
				method: 'POST',
				url: '/signin',
				data: $scope.signinAccount
			}).then(function(data){
				var token = jwtHelper.decodeToken(data.accessToken);
				$window.localStorage.token = data.accessToken;
				$window.localStorage.username = token.username;
				$window.localStorage.id = token.id;
			}, function(error){
				console.log(error.data);
			});
		}
	}])
