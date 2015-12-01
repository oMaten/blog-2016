angular.module('blog.server', ['ngResource'])
	.factory('Posts', ['$resource', function($resource){
		return $resource('/api/posts', null, {
				query: {method: 'GET', isArray: true}
			});
	}])
	.factory('Comments', ['$resource', function($resource){
		return $resource('/api/posts/:postId/comments', {postsId: '@postId'}, {
			query: {method: 'GET', isArray: true}
		});
	}]);