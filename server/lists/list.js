var db = require('../cfg').db();
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var listsSchema = new Schema({
	lid: {type:String, index:{unique: true}},
	shops: String,
	timestamp: String,
	stores: Array,
	items: Array
}, { strict: false });
//mongoose.connect(db.url);


module.exports = mongoose.model('List', listsSchema);
