angular.module('blog.controller.post', [
    'blog.server',
    'angular-storage'
  ])
  .controller('PostsListCtrl', ['$scope', '$rootScope', 'Posts', 'store', function($scope, $rootScope, Posts, store){
    Posts
      .list()
      .$promise
      .then(function(data){
        $scope.posts = data.posts;
      }, function(error){
        console.log(error.data);
      });
    $scope.newPost = {};
    $scope.createPost = function(){
      if($scope.newPost.title){
        Posts
          .save($scope.newPost)
          .$promise
          .then(function(post){
            console.log(post);
            $scope.newPost = {};
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
