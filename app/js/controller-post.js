angular
  .module('blog.controller.post', [
    'blog.server',
    'angular-storage'
  ])
  .controller('PostsListCtrl', ['$scope', '$rootScope', '$stateParams', 'Posts', 'store', '$state', function($scope, $rootScope, $stateParams, Posts, store, $state){
    Posts
      .list({userId: $stateParams.id})
      .$promise
      .then(function(data){
        $scope.posts = data.posts;
      }, function(error){
        console.log(error.data);
      });
    $scope.newPost = {};
    $scope.posts = [];
    $scope.createPost = function(){
      if($scope.newPost.content){
        Posts
          .save($scope.newPost)
          .$promise
          .then(function(res){
            $scope.newPost = {};
            $scope.posts.unshift(res.post);
          }, function(error){
            console.log(error.data);
          });
      }
    };

  }])
  .controller('PostCtrl', ['$scope', '$rootScope', '$stateParams', 'Posts', function($scope, $rootScope, $stateParams, Posts){
    Posts
      .get({postId: $stateParams.id})
      .$promise
      .then(function(data){
        $scope.post = data.post;
      }, function(error){
        console.log(error.data);
      });
  }]);
