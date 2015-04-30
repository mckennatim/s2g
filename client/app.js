'use strict';

var app = angular.module("App", [
    'ui.bootstrap',
    'ui.router',
    'sbOnline',
    'sbReg',
    'sbList',
    'sbLists',
    'sbBlank'
    ]);

app.constant('cfg', {
    setup: function(){
        var port = 3005;
        var host = 'http://10.0.1.109'
        var url = host + ':'+port+'/api/';
        var prefix = 'al_';
        var toState = 'lists'
        return {
            port: port,
            url: url,
            prefix: prefix,
            toState: toState
        }
    },
    afterReg: function(user){
        console.log(user + ' is registered w/token')
    }
})

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
    $stateProvider.state('splash',{
        url:'/',
        template: '<h4>Splash</h4>'
    });
    $urlRouterProvider.otherwise('/');    
}])

