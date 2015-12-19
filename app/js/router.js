angular.module('blog', ['ui.router', 'blog.server', 'blog.controller', 'angular-jwt'])
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
						templateUrl: '../html/signin.html',
						controller: 'SigninCtrl'
					}
				}
			})
			.state('signup', {
				url: '/signup',
				views: {
					'header': {
						templateUrl: '../html/_header.html'
					},
					'main': {
						templateUrl: '../html/signup.html',
						controller: 'SignupCtrl'
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
	}])
	.config(['$httpProvider', 'jwtInterceptorProvider', function($httpProvider, jwtInterceptorProvider){
		$httpProvider.interceptors.push(function(){
			return {
				'response': function(response){
					console.log(response);
					return response;
				}
			}
		});
	}]);
