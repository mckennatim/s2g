var express = require('express');
var router = express.Router();
var _ = require('underscore');
var User = require('./reg/user');
var dbase = require('./cfg').db().db;
var cons = require('tracer').console();
var db;
var Server = require('mongodb').Server
var MongoClient = require('mongodb').MongoClient
var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {db = mongoClient.db(dbase);})

var isRightList = function(lists, list){
        return _.find(lists, function(obj) { return obj.lid == list })
}

module.exports = function(passport){
	router.get('/api/dog', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res) {
		res.jsonp('You are a dog, Uli')
	});	
	
	router.get('/api/users/:name', 
		passport.authenticate('bearer', { session: false }), 
		function(req, res) {
			console.log('in find user by name');
			console.log(req.params);
			var name = req.params.name;
			db.collection('users', function(err, collection) {
				collection.findOne({name:name},function(err, items) {
					console.log(items);
					res.jsonp({message:'success', items:items});
				});
			});
		}
	);
	router.delete('/api/users/:name',
		passport.authenticate('bearer', { session: false }),  
		function(req, res) {
			console.log('in delete user by name');
			console.log(req.params);
			var name = req.params.name;
			db.collection('users', function(err, collection) {
				collection.remove({
					name: name
				}, function(err, saved) {
					if (err) {
						res.jsonp(err)
					} else {
						res.jsonp(saved)
					};
				});
			});
		}
	);

	return router;
}