angular.module('blog.server', ['ngResource'])
	.factory('Posts', ['$resource', function($resource){
		return $resource('/api/posts/:postId',
      {},
      {
        'list': {method: 'GET', isArray: false}
      }
    );
	}])
	.factory('Comments', ['$resource', function($resource){
		return $resource('/api/posts/:postId/comments/:commentId',
      {
        'postId': '@postId'
      }
    );
	}])
	.factory('Users', ['$resource', function($resource){
		return $resource('/api/users/:userId',
      {},
      {
        'list': {method: 'GET', isArray: false}
      }
    );
	}])
  .factory('Follow', ['$resource', function($resource){
    return $resource('/api/follow',
      {},
      {
        'list': {method: 'GET', isArray: false},
        'follow': {method: 'POST', isArray: false},
        'unfollow': {method: 'POST', isArray: false, url: '/api/unfollow'}
      }
    );
  }])
