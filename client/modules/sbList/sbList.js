var sbList = angular.module('sbList', []);

sbList.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	$stateProvider.state('list',{
		url:'/list',
		template: '<h4>List</h4><sb-list></sb-list>'
	});
}])


sbList.directive('sbList', ['ListService', 'cfg', function(ListService, cfg){
	return{
		restrict: 'E',
		scope: {}, 
		templateUrl: "modules/sbList/sb-list.html",
		controller: function(){
		},
		link: function(scope, element, attrs){
			scope.dog = 'Uli'
		}
	}
}])

sbList.factory('ListService', ['$http', function($http){
	return{
		dog: 'Uli'
	}
}])