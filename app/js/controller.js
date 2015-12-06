angular.module('blog.controller', [])
	.controller('PostsListCtrl', ['$scope', '$rootScope', 'Posts', function($scope, $rootScope, Posts){
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
	}]);