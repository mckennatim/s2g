var express = require('express');
var router = express.Router();
var _ = require('underscore');
var List = require('./list');
var cons = require('tracer').console();

var isRightList = function(lists, list){
        return _.find(lists, function(obj) { return obj.lid == list })
}

module.exports = function(passport){
	router.get('/api/frog', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res) {
		cons.log('you frog')
		res.jsonp('You are a frog, Uli')
	});

	router.get('/api/lists/:lid', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res){ 
			console.log('in getList by lid');
			var lid = req.params.lid;
			if (isRightList(req.user.lists, lid)) {
     				List.findOne({lid: lid}, function(err, items){
     					res.jsonp(items)
     				})
			} else {
				res.jsonp({message: 'that is not one of your lists', lists: req.user.lists})
			}
		}
	)
	router.put('/api/lists/:lid', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res){ 
			console.log('XXXXX in update list/:lid');
			var lid = req.params.lid;
			if (isRightList(req.user.lists, lid)) {
     				List.update({lid: lid},{$set:body}, function(err, items){
     					res.jsonp(items)
     				})
			} else {
				res.jsonp({message: 'that is not one of your lists', lists: req.user.lists})
			}
		}
	)

	return router;

}