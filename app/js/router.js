angular.module('blog.router', [
		'ui.router'
	])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					'header': {
						templateUrl: '../html/_header.html',
						controller: 'MineCtrl'
					},
					'main': {
						templateUrl: '../html/home.html',
						controller: 'HomeCtrl'
					}
				},
				validate: {
					'requestSignin': true
				}
			})
			.state('signin', {
				url: '/signin',
				views: {
					'main': {
						templateUrl: '../html/signin.html',
						controller: 'SigninCtrl'
					}
				}
			})
			.state('signout', {
				url: '/signout',
				views: {
					'main': {
						templateUrl: '../html/signout.html',
						controller: 'SignoutCtrl'
					}
				}
			})
			.state('allUsers', {
				url: '/users',
				views: {
					'header': {
						templateUrl: '../html/_header.html',
						controller: 'MineCtrl'
					},
					'main': {
						templateUrl: '../html/user-list.html',
						controller: 'UsersListCtrl'
					}
				},
				validate: {
					'requestSignin': true
				}
			})
			.state('users', {
				url: '/users/:id',
				views: {
					'header': {
						templateUrl: '../html/_header.html',
						controller: 'MineCtrl'
					},
					'main': {
						templateUrl: '../html/post.html',
						controller: 'PostsListCtrl'
					},
					'user': {
						templateUrl: '../html/user.html',
						controller: 'UserCtrl'
					}
				},
				validate: {
					'requestSignin': true
				}
			})
	}]);
