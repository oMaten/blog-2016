angular
  .module('blog', [
    'blog.router',
    'blog.server',
    'blog.controller.signin',
    'blog.controller.user',
    'angular-jwt',
    'angular-storage'
  ])
  .config(['$httpProvider', 'jwtInterceptorProvider', function($httpProvider, jwtInterceptorProvider){

    // 在每个 request 中发送 store 中的 accessToken

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
          console.log(request);
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
  .run(['$rootScope', '$state', 'store', 'jwtHelper', 'User', 'Post', function($rootScope, $state, store, jwtHelper, User, Post){

      // 在跳转路径前检查是否需要登录,
      // 若需要登录则获取 store 中的 accessToken, 并且检查 accessToken 是否过期,
      // 若 store 中不存在 accessToken 或者 accessToken 已经过期则删除 accessToken 并且跳转登录页面,
      // 若 store 中存在 accessToken 并且 accessToken 合法则通过 userId 获取用户

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams){
      if(toState.validate && toState.validate.requestSignin){
        if(!store.get('accessToken') || jwtHelper.isTokenExpired(store.get('accessToken'))){
          store.remove('accessToken');
          e.preventDefault();
          $state.go('signin');
        }else{
          var tokenPayload = jwtHelper.decodeToken(store.get('accessToken'));
          var formData = { userId: tokenPayload.userId };
          if(toParams.id){
            formData.userId = toParams.id;
          }
          User.getUser(formData);

          $rootScope.userId = tokenPayload.userId;
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams){
      $rootScope.isUser = true;

      // 用户页面

      if($state.current.name == 'user'){
        Post.getAllPosts({ userId: toParams.id });
        User.getFollowStatus({ userId: toParams.id });
      }

      // 主页

      if($state.current.name == 'home'){
        Post.getAllPosts(toParams);
      }

      // 用户列表

      if($state.current.name == 'allUsers'){
        User.getUsersList(toParams);
      }

      if(toParams.id && toParams.id !== $rootScope.userId){
        $rootScope.isUser = false;
        $rootScope.userId = toParams.id;
      }
    });

  }]);
