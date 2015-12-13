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
				Posts.save($scope.newPost);
				$scope.newPost = {};
				$location.path('/');
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
				console.log(error);
			});
	}])
	.controller('Signup', ['$scope', '$rootScope', 'Users', function($scope, $rootScope, Users){
		$scope.signupAccount = {};
		$scope.signupValidate = function(){
			if(!$scope.signupAccount.username || !$scope.signupAccount.password || !$scope.signupAccount.repassword){
				console.log('1111');
				return false;
			}
			if($scope.signupAccount.password !== $scope.signupAccount.repassword){
				console.log('2222');
				return false;
			}
			Users
				.save($scope.signupAccount)
				.$promise
				.then(function(data){
					delete $scope.signupAccount.username;
					delete $scope.signupAccount.password;
					delete $scope.signupAccount.repassword;
					console.log(data);
				});
		};
	}]);
