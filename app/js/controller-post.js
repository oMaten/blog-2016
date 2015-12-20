angular.module('blog.controller.post', ['blog.server'])
  .controller('PostsListCtrl', ['$scope', '$rootScope', 'Posts', function($scope, $rootScope, Posts){
    Posts
      .list()
      .$promise
      .then(function(data){
        $scope.posts = data.posts;
        $rootScope.username = data.username;
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
      .then(function(post){
        $scope.post = post;
      }, function(error){
        console.log(error.data);
      });
  }]);
