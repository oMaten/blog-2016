var app = angular.module('blog', ['ui.router', 'blog.server'])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					'header': {
						templateUrl: '../html/_header.html'
					},
					'main': {
						templateUrl: '../html/home.html',
						controller: 'PostsListCtrl'
					}
				}
			})
			.state('signin', {
				url: '/signin',
				views: {
					'header': {
						templateUrl: '../html/_header.html'
					},
					'main': {
						templateUrl: '../html/signin.html'
					}
				}
			})
			.state('posts', {
				url: '/posts/:id',
				views: {
					'header': {
						templateUrl: '../html/_header.html'
					},
					'main': {
						templateUrl: '../html/post.html',
						controller: 'PostCtrl'
					}
				}
			});
	}]);

app.controller('PostsListCtrl', ['$scope', '$rootScope', 'Posts', function($scope, $rootScope, Posts){
	Posts
		.query()
		.$promise
		.then(function(posts){
			$scope.posts = posts;
		}, function(error){
			console.log(error);
		});
}]);

app.controller('PostCtrl', ['$scope', '$rootScope', '$stateParams', 'Post', function($scope, $rootScope, $stateParams, Post){
	Post
		.get({postId: $stateParams.id})
		.$promise
		.then(function(post){
			$scope.post = post;
		}, function(error){
			console.log(error);
		});
}]);