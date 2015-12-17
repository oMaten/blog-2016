angular.module('blog.controller', [])
	.controller('PostsListCtrl', ['$scope', '$rootScope', '$location', 'Posts', function($scope, $rootScope, $location, Posts){
		Posts
			.query()
			.$promise
			.then(function(posts){
				$scope.posts = posts;
			}, function(error){
				console.log(error);
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
						console.log(error);
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
				console.log(error.data.error);
			});
	}])
	.controller('SignupCtrl', ['$scope', '$rootScope', 'Users', function($scope, $rootScope, Users){
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
					delete $scope.signupAccount.username;
					delete $scope.signupAccount.password;
					delete $scope.signupAccount.repassword;
					console.log(data)
				}, function(error){
					console.log(error.data.error);
				});
		};
	}])
	.controller('SigninCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){
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
				console.log(data);
			}, function(error){
				console.log(error.data.error);
			})
		}
	}])
