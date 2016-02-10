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

    /*
      在每个 request 中发送 store 中的 accessToken
    */
    $httpProvider.interceptors.push(function(store){
      return {
        'response': function(response){
          response.status = response.status || 200;
          if(response.status === 201){
            console.log('response:', response);
          }
          return response;
        },
        'request': function(request){
          request.headers = request.headers || {};
          if(store.get('accessToken')){
            request.headers.accessToken = store.get('accessToken');
          }
          return request;
        },
        'responseError': function(response){
          console.log(response.data);
          return response;
        }
      }
    });

  }])
  .run(['$rootScope', '$state', 'store', 'jwtHelper', function($rootScope, $state, store, jwtHelper){
    /*
      在跳转路径前检查是否需要登录,
      若需要登录则获取 store 中的 accessToken, 并且检查 accessToken 是否过期,
      若 store 中不存在 accessToken 或者 accessToken 已经过期则删除 accessToken 并且跳转登录页面,
      若 store 中存在 accessToken 并且 accessToken 合法则将 userId 存入 rootScope 中
    */

    $rootScope.$on('$stateChangeStart', function(e, toState){
      if(toState.validate && toState.validate.requestSignin){
        if(!store.get('accessToken') || jwtHelper.isTokenExpired(store.get('accessToken'))){
          store.remove('accessToken');
          e.preventDefault();
          $state.go('signin');
        }else{
          var accessToken = store.get('accessToken');
          var tokenPayload = jwtHelper.decodeToken(accessToken);
          $rootScope.userId = tokenPayload.userId;
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams){
    });

  }]);
