angular.module('blog', ['ui.router', 'blog.server', 'blog.controller.signin', 'blog.controller.user', 'blog.controller.post', 'angular-jwt'])
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
			})
			.state('users', {
				url: '/users/:id',
				views: {
					'header': {
						templateUrl: '../html/_header.html'
					},
					'main': {
						templateUrl: '../html/user.html',
						controller: 'UserCtrl'
					}
				}
			})
	}])
	.config(['$httpProvider', 'jwtInterceptorProvider', function($httpProvider, jwtInterceptorProvider){
		$httpProvider.interceptors.push(function(){
			return {
				'response': function(response){
					console.log(response);
					return response;
				},
				'request': function(request){
					if(window.localStorage.token){
						request.headers.accessToken = window.localStorage.getItem('token');
					}
					return request;
				}
			}
		});
	}]);
