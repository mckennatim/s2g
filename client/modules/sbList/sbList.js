var sbList = angular.module('sbList', []);

sbList.config(['$urlRouterProvider', '$stateProvider',  function($urlRouterProvider, $stateProvider){
	$stateProvider.state('list',{
		url:'/list/:lid',
		template: '<h4>{{lid}} List {{dog}}</h4><sb-list lid="{{lid}}" list=list upd="updd(message)"></sb-list>{{list}}',
		controller: 'ListController'
	});
}])

sbList.controller('ListController',['$state', '$stateParams', 'Lists', '$scope', function($state, $stateParams, Lists, $scope){
	var dog ='kazzy';
	$scope.dog = dog;
	$scope.lid = $stateParams.lid;
	// Lists.getList($scope.lid).then(function(data){
	// 	$scope.list=data;
	// });
	Lists.updList($scope.lid).then(function(list){
		$scope.list = list
	});
	$scope.updd = function(message){
		console.log('its updating ' +message)
		Lists.saveLocal()
	};

}]) 

sbList.directive('sbList', ['List', 'cfg', 'ioService', function(List, cfg, ioService){
	return{
		restrict: 'E',
		scope: {
			lid: "@",
       		upd: "&",
			list: "="
		}, 
		templateUrl: "modules/sbList/sb-list.html",
		controller: function(){

		},
		link: function(scope, element, attrs){
			scope.dog = 'Uli'
			//var io = ioService.socket
			scope.showLoc=true;
			scope.showTags=true;
			//io.emit('switchLid',scope.lid);
			var replace = function(item,oldProduct){
				if (scope.list){
					var idx = find(oldProduct);
					if(idx==-1){
						scope.list.items.push(item);					
					}else{
						rep4idx(idx, item);
					}					
				}else{
					console.log('there is no list on this machine')
				}

			}
			var del =function(item){
				if (scope.list){
					var idx = find(item.product);
					scope.list.items.splice(idx,1);
				}else{
					console.log('there is no list on this machine')
				}				
			}
			var ad = function(item){
				if (scope.list){
					var idx = find(item.product);
					if(idx == -1){
						scope.list.items.push(item);
					}else{
						var found = scope.list.items[idx]
						found.done = false;
						scope.list.items[idx] = found;
					}
				}else{
					console.log('there is no list on this machine')
				}				
			}			
			var find = function(product){
				product = product.toLowerCase();
				return scope.list.items.map(function (el){
					return el.product.toLowerCase()
				}).indexOf(product)
			}
			var rep4idx = function(idx,item){
				scope.list.items[idx]=item
			}			
			// io.on('itemChanged', function(data){
			// 	console.log(data.action +  '; ' + data.oldProduct + ' with:');
			// 	console.log(data.item);
			// 	switch (data.action){
			// 		case 'modify':
			// 			//modify(data.item);
			// 			replace(data.item, data.item.product)
			// 			break;
			// 		case 'add':
			// 			ad(data.item);
			// 			break;
			// 		case 'delete':
			// 			del(data.item);
			// 			break;                                             
			// 		case 'replace':
			// 			replace(data.item, data.oldProduct)
			// 			break;                                             
			// 	}
			// 	scope.$apply();
			// 	scope.upd({message:'from remote'})
			// })
			scope.ckDone = function(item){
				var message = {action:'modify', item:item}
				console.log(message.item)
				//io.emit('message', message)
				scope.upd({message:'from local ckUpd'})
			}
			scope.remove= function(item){
				var message = {action:'delete', item:item}
				del(message.item)
				console.log(message.item)
				io.emit('message', message)
				scope.upd({message:'from local remove'})
			}; 
			scope.rubmit= function(item){
				var item;
				if (scope.query) {
					item={product: this.query, done:false};
					ad(item)				
					var message = {action:'add', item:item}
					console.log(message.item)
					io.emit('message', message)
					scope.upd({message:'from local ad'})
					scope.query = '';
				}				
			}  	
			scope.editBuffer={} 
			var editedItem ={}
			scope.editItem = function(item){
				console.log(item)
				scope.editedItem= item;
				scope.buffer = JSON.parse(JSON.stringify(item));
				console.log(scope.buffer)
			};
			scope.doneEditing = function(buffer){
				console.log('in doneEditing')  
				console.log(buffer)      
				var oldProduct =   scope.editedItem.product; 
				scope.editedItem.product = buffer.product.trim();
				if(buffer.loc){scope.editedItem.loc = buffer.loc.trim();}
				console.log(buffer.tags)
				if(buffer.tags && buffer.tags.length>0){scope.editedItem.tags = buffer.tags;}
				console.log(buffer.amt);
				if (buffer.amt){
					scope.editedItem.amt = {qty:0, unit:''}
					if(buffer.amt.qty){
						scope.editedItem.amt.qty = buffer.amt.qty.trim()
					};
					if(buffer.amt.unit){
						scope.editedItem.amt.unit = buffer.amt.unit.trim()
					};        
				}
				console.log(scope.editedItem)
				var message={action:'replace', item:scope.editedItem, oldProduct:oldProduct}
				console.log(message.item)
				io.emit('message', message)
				scope.upd({message:'from local doneEditng'})				
				scope.editedItem = null;
			};
			scope.revertEdit = function(item){
				console.log('escaped into revertEdit')
				scope.editedItem = null;
			}; 
		}
	}
}])

sbList.factory('List', ['$http', '$rootScope', '$q', function($http, $rootScope, $q){
	return{
		dog: 'Uli',
	}
}])

sbList.service("ioService", function($q, $timeout, cfg) {  
	console.log('the ioservice has started')
	var port = cfg.setup().port;    
	//var socket = io.connect('localhost:' + port);
	console.log('connected in ioService')
	var service = {
		dog: 'fred',
		//socket: socket,
		port: port
	}
	return service;
});