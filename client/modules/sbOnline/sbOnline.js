var sbOnline = angular.module('sbOnline', []);

sbOnline.config(function ($httpProvider) {
    $httpProvider.interceptors.push('OnlineInterceptor');
});

sbOnline.run(function($window, $rootScope){
  $rootScope.online=false;
  $rootScope.status=0;
})

sbOnline.factory('OnlineInterceptor', function($rootScope, $q){
        var Interceptor ={
            responseError: function(response){
                console.log(response)
                $rootScope.status = response.status;
                $rootScope.online = false;
                return $q.when(response);
            },
            response: function(response){
                //console.log(response.status)
                if (response.config.url.substring(0,8)=='partials'){//hack
                    $rootScope.status = response.status;
                    $rootScope.online = false;                    
                }else{
                    $rootScope.status = response.status;
                    $rootScope.online = true;                    
                }
                //console.log(response.config.url)
                //console.log('inter resp '+$rootScope.online+ response.status)
                return $q.when(response);           
            }
        };
        return Interceptor;
})

sbOnline.directive('sbOnline', ['$rootScope', 'Online', function($rootScope, Online){
	return{
		restrict: 'E',
		//needs bootstrap
		template: '<span class="glyphicon glyphicon-signal" ng-show="online"></span><span class="glyphicon glyphicon-ban-circle" ng-show="!online"></span>',
		link: function(scope, element, attrs){
			Online.ckIfOnline().then(function(){
				console.log($rootScope.online)
				scope.online = $rootScope.online;
			});
			$rootScope.$watch('online', function(newValue, oldValue){
					//console.log('watched')
					//console.log(newValue)
					if (newValue !== oldValue) {
							scope.online=newValue;
							console.log('$rootScope.online changed to: '+$rootScope.online )
							if(newValue){
									
							}                
					}                       
			});            
		}
	}
}]);

sbOnline.factory('Online', ['$q', '$http', 'cfg', function($q, $http, cfg){
	var httpLoc= cfg.setup().url;
	return{
		ckIfOnline: function(){
			var deferred =$q.defer()
			$http.get(httpLoc).
			success(function(data,status){
				deferred.resolve(status);
			}).
			error(function(data,status){
				deferred.reject(status);
			}); 
			return deferred.promise;                         
		}		
	}	
}])