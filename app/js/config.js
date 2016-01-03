angular.module('blog', [
    'blog.router',
    'blog.server',
    'blog.controller.signin',
    'blog.controller.user',
    'blog.controller.post',
    'angular-jwt',
    'angular-storage'
  ])
  .config(['$httpProvider', 'jwtInterceptorProvider', function($httpProvider, jwtInterceptorProvider){

    $httpProvider.interceptors.push(function(){
      return {
        'response': function(response){
          console.log(response);
          return response;
        },
        'request': function(request){
          if(window.localStorage.accessToken){
            request.headers.accessToken = window.localStorage.getItem('accessToken');
          }
          return request;
        },
        'responseError': function(response){
          console.log(response.data);
        }
      }
    });

  }])
  .run(['$rootScope', '$state', 'store', 'jwtHelper', function($rootScope, $state, store, jwtHelper){

    $rootScope.$on('$stateChangeStart', function(e, to){
      if(to.validate && to.validate.requestSignin){
        if(!store.get('accessToken') || jwtHelper.isTokenExpired(store.get('jwt'))){
          e.preventDefault();
          $state.go('signin');
        }
      }
    });

  }]);
