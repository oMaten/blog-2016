angular
	.module('blog.router', [
		'ui.router'
	])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/?getFollow&q_post&p&q_topic',
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
				url: '/users?getFollowing&getFollowed&userId&q_username',
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
				url: '/user/:id/info?password',
				views: {
					'main': {
						templateUrl: '../html/profile.html',
						controller: 'HomeCtrl'
					}
				},
				validate: {
					'requestSignin': true
				}
			})
			.state('backend', {
				url: '/backend',
				views: {
					'main': {
						templateUrl: '../html/backend.html',
						controller: 'BackendCtrl'
					}
				},
				validate: {
					'requestSignin': true,
					'requestAdmin': true
				}
			});
	}]);
