angular
	.module('blog.router', [
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
				url: '/users?getFollowing&getFollowed&userId',
				views: {
					'header': {
						templateUrl: '../html/_header.html',
						controller: 'MineCtrl'
					},
					'main': {
						templateUrl: '../html/user-list.html',
						controller: 'UserItemCtrl'
					}
				},
				validate: {
					'requestSignin': true
				}
			})
			.state('user', {
				url: '/user/:id/home',
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
			.state('info', {
				url: '/user/:id/info',
				views: {
					'main': {
						templateUrl: '../html/info.html',
						controller: 'HomeCtrl'
					}
				},
				validate: {
					'requestSignin': true
				}
			});
	}]);
