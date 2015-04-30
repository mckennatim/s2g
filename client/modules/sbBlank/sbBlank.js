var sbBlank = angular.module('sbBlank', []);

sbBlank.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	$stateProvider.state('blank',{
		url:'/blank',
		template: '<h4>sbBlank</h4><sb-blank></sb-blank>'
	});
}])


sbBlank.directive('sbBlank', ['ListService', 'cfg', function(ListService, cfg){
	return{
		restrict: 'E',
		scope: {}, 
		templateUrl: "modules/sbBlank/sb-blank.html",
		controller: function(){
		},
		link: function(scope, element, attrs){
			scope.dog = 'Uli'
		}
	}
}])

