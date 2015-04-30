var sbLists = angular.module('sbLists', []);

sbLists.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	$stateProvider.state('lists',{
		url:'/lists',
		template: '<h4>sbLists</h4><sb-lists-dd></sb-lists-dd>'
	});
}])


sbLists.directive('sbListsDd', ['cfg', 'UserService', 'Lists', '$state', function(cfg, UserService, Lists, $state){
	return{
		restrict: 'E',
		scope: {}, 
		templateUrl: "modules/sbLists/sb-lists-dd.html",
		controller: function(){
    			this.go =function(def){
    				console.log(def)
    				Lists.makeActive(def.lid)
    				$state.go("list", {lid: def.lid})
    			} 			
		},
		controllerAs: 'sbListsDdCtrl',
		link: function(scope, element, attrs){
			scope.dog = 'Uli'
			scope.users = UserService.al;
		}
	}
}])

sbLists.factory('Lists', ['$http', '$q', 'cfg', '$rootScope', function($http, $q, cfg, $rootScope){
	var pfx = cfg.setup().prefix;
	var httpLoc= cfg.setup().url;
	var clists = pfx+'clists';
	var plists = pfx+'plists';
	var clistsStr = localStorage.getItem(clists)
	var lal = !clistsStr ? {} : JSON.parse(clistsStr); 
	//var activeList= lal.activeList='Jutebi';   
	var getClist =function(lid){
		var list;
		if (lal[lid]){
			list= lal[lid]
		}else{
			lal = JSON.parse(localStorage.getItem(clists))
			list = lal[lid];
			if (!list){
				list = {lid: lid, shops: '', timestamp: 0, items:[], stores: []}
				lal[lid]= list;
				localStorage.setItem(clists, JSON.stringify(lal));				
			}
		}
		return list;
	};
	var setClist =function(list){
		var pal=JSON.parse(localStorage.getItem(clists)) || {};
		pal[list.lid]=list;
		localStorage.setItem(clists, JSON.stringify(pal));		
	}
	var setPlist =function(list){
		var pal=JSON.parse(localStorage.getItem(plists)) || {};
		pal[list.lid]=list;
		localStorage.setItem(plists, JSON.stringify(pal));		
	}
	var getPlist =function(lid){
		var pal=JSON.parse(localStorage.getItem(plists)) || {};
		var plist = pal[lid];
		if (pal[lid]){
			plist= pal[lid]
		}else{		
			plist = {lid: lid, shops: '', timestamp: 0, items: [], users: []}
			pal[lid]=plist;
			localStorage.setItem(plists, JSON.stringify(pal));
		}
		return plist;
	}
	var difference= function(array){
		var prop =arguments[2];
		var rest = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
		var containsEquals = function(obj, target) {
			if (obj == null) return false;
			return _.any(obj, function(value) {
				return value[prop] === target[prop];
			});
		};
		return _.filter(array, function(value){
			return ! containsEquals(rest, value); 
		});
	};
	var union= function (arr1, arr2, prop) {
		var sa1= JSON.stringify(arr1);
		var arr3 = JSON.parse(sa1);
		_.each(arr2, function(arr2obj) {
			var arr1obj = _.find(arr1, function(arr1obj) {
				return arr1obj[prop] === arr2obj[prop];
			});
			arr1obj ? _.extend(arr3, arr2obj) : arr3.push(arr2obj);
		});
		return arr3
	};   
	var merge= function(pz2,cz2,sz2){
		// (C\(P\S))U(S\(P\C))
		var condT = {'done': true};
		var condF = {'done': false};
		var p = _.filter(pz2, condF);
		var c = _.filter(cz2, condF);
		var s = _.filter(sz2, condF);
		var sT = _.filter(sz2, condT);
		var ps = difference(p,s, 'product');
		var pc = difference(p,c, 'product' );
		var cps = difference(c,ps, 'product');
		var spc = difference(s,pc, 'product');
		var arr3 = union(spc, cps, 'product');
		//(MERGED{'done':false}) U (Server,{'done': true})
		var arr4 = union(arr3, sT, 'product');
		return arr4
	};
	return{
		cat: 'mabibi',
		lal:lal,    
		saveLocal: function(){
			lal[lal.activeList].timestamp = Date.now();
			localStorage.setItem(clists, JSON.stringify(lal));
		},
		makeActive:function(lid){
			lal.activeList = lid;
		},
		getList: function(lid){
			var deferred =$q.defer();
			console.log('in Lists.getActive')
			console.log(lid)
			var thelist 
			if(lal[lid]==undefined){
				this.dBget(lid).then(function(data){
					console.log(data);
					lal[lid]=data;
					deferred.resolve(lal[lid])
				}) 
			}else{
				deferred.resolve(lal[lid])
				console.log(lal[lid])
			}
			return deferred.promise;
		},
		dBget: function(lid){
			var deferred =$q.defer();
			var url=httpLoc + 'lists/'+lid; 
			$http.get(url).   
			success(function(data, status) {
				console.log('GET list from server: '+status);
				lal[lid]= data;
				localStorage.setItem(clists, JSON.stringify(lal));
				deferred.resolve(data)
			}) .
			error(function(data, status){
				deferred.reject(data)
			});
			return deferred.promise                          
		},
		updList: function(lid){
			var deferred =$q.defer();
			var list = getClist(lid);
			console.log('in updList, $rootScope.online: ' +$rootScope.online)
			if(!$rootScope.online){
				deferred.resolve(list)
			}else{  
				var c, p, s, cts, sts, pts, nts, updItems, stores;
				c = list;
				cts = c.timestamp;
				p = getPlist(lid);
				pts = p.timestamp;
				var url=httpLoc + 'lists/'+lid; 
				$http.get(url).   
				success(function(data, status) {
					console.log('GET list from server: '+status)
					var putIt=false;
					s=data;
					delete s.users;
					stores = s.stores;
					sts = s.timestamp
					console.log(c.lid)
					console.log('pts: '+pts +' ' + new Date(pts))
					console.log('cts: '+cts +' ' + new Date(cts))
					console.log('sts: '+sts +' ' + new Date(sts))                        
					if (sts > pts){ //if server has been updated since prior LS
						console.log('merging')
						updItems=merge(p.items, c.items, s.items);
						nts=Date.now();
						c.items=updItems;
						c.timestamp =nts;
						c.stores=stores;
						setClist(c);
						putIt=true
					} else if(cts==pts && cts==sts){
						console.log('timestamps =, doing nothing')   
					} else {
						console.log('just sending c ')
						updItems=c.items;
						c.stores=stores;
						setClist(c);
						nts=cts;
						putIt=true
					}
					if (putIt){
						p.items = updItems;
						p.timestamp = nts;
						p.stores = stores;
						setPlist(p);
						$http.put(url, {timestamp:nts, items: updItems}).
							success(function(data, status) {
								console.log('PUT updated list on server: ' +status)
								console.log(data)
							}).                
							error(function(data, status){
								console.log(status)
							});
						deferred.resolve(p); 
					}                                                                          
				}).
				error(function(data, status){
					deferred.reject(data)
				});
			}
			return deferred.promise
		}           						
	}
}])

