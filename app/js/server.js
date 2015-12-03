angular.module('blog.server', ['ngResource'])
	.factory('Posts', ['$resource', function($resource){
		return $resource('/api/posts');
	}])
	.factory('Post', ['$resource', function($resource){
		return $resource('/api/posts/:postId');
	}])
	.factory('Comments', ['$resource', function($resource){
		return $resource('/api/posts/:postId/comments');
	}]);