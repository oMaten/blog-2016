angular
	.module('blog.controller.signin', [
		'blog.server',
		'angular-storage',
		'angular-jwt'
	])
	.controller('SigninCtrl', ['$scope', '$rootScope', '$window', '$http', '$state', '$interval', 'store', 'Users', 'jwtHelper', function($scope, $rootScope, $window, $http, $state, $interval, store, Users, jwtHelper){

		$scope.signupAccount = {};
		$scope.signinAccount = {};
		$scope.time =	0;

		$interval(function(){
			$scope.time = ($scope.time + 1) % 4;
		}, 10000);

		$scope.signupValidate = function(){
			console.log($scope.signupAccount);
			if(!$scope.signupAccount.username || !$scope.signupAccount.password || !$scope.signupAccount.repassword){
				return false;
			}
			if($scope.signupAccount.password !== $scope.signupAccount.repassword){
				return false;
			}
			Users
				.save($scope.signupAccount)
				.$promise
				.then(function(response){
					store.set('accessToken', response.accessToken);
					var tokenPayload = jwtHelper.decodeToken(store.get('accessToken'));
					$state.go('info', { 'id': tokenPayload.userId });
				}, function(error){
					console.log(error.data);
				});
		};


		$scope.signinValidate = function(){
			if(!$scope.signinAccount.username || !$scope.signinAccount.password){
				return false;
			}
			$http({
				method: 'POST',
				url: '/signin',
				data: $scope.signinAccount
			}).then(function(response){
				store.set('accessToken', response.data.accessToken);
				var tokenPayload = jwtHelper.decodeToken(store.get('accessToken'));
				$state.go('home', { 'getFollow': 'true', 'p': '1' });
			}, function(error){
				console.log(error.data);
			});
		}
	}])
	.controller('SignoutCtrl', ['$scope', '$rootScope', '$window', '$state', 'store', function($scope, $rootScope, $window, $state, store){
		$rootScope.userId = null;
		store.get('accessToken') && store.remove('accessToken');
		$state.go('signin');
	}])
	.controller('BackendCtrl', ['$scope', '$rootScope', '$window', '$state', 'store', 'User', 'Post', 'Comment', function($scope, $rootScope, $window, $state, store, User, Post, Comment){
		$scope.search = {};
		$scope.searchSubmit = function(){
			if($scope.search.comment){
				Comment.getAllComments({
					'q_comment': $scope.search.comment,
					'q_username': $scope.search.user
				});
				$scope.search = {};
				return
			}
			if($scope.search.topic){
				Post.getAllPosts({
					'q_topic': $scope.search.topic,
					'q_post': $scope.search.post,
					'q_username': $scope.search.user,
					'p': 1
				});
				$scope.search = {};
				return;
			}
			if($scope.search.post){
				Post.getAllPosts({
					'q_post': $scope.search.post,
					'q_username': $scope.search.user,
					'p': 1
				});
				$scope.search = {};
				return
			}
			if($scope.search.user){
				User.getUsersList({'q_username': $scope.search.user});
				$scope.search = {};
				return
			}
		};

		$scope.forbindPost = function(id){
			User.forbindUser(id);
		};

		$scope.deleteUser = function(id){
			if($scope.listType == 'users'){
				return User.deleteUser(id);
			}
			if($scope.listType == 'posts'){
				return Post.deletePost(id);
			}
			if($scope.listType == 'comments'){
				return Comment.deleteComment(id);
			}
		};

		var gotAllCommentList = $scope.$on('Comments.fetchAllComments', function(){
			$scope.list = Comment.list;
			$scope.listType = 'comments';
		});

		var gotAllPostList = $scope.$on('Post.fetchAllPosts', function(){
			$scope.list = Post.list;
			$scope.listType = 'posts';
		});

		var gotAllUserList = $scope.$on('User.fetchUsersList', function(){
      $scope.list = User.list
      $scope.listType = 'users';
    });
	}]);
