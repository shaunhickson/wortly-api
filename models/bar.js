var mongoose = require('mongoose');

var BarSchema = mongoose.Schema({
	name: String,
	address: String,
	zip: String,
	//loc: {type: [Number], index: '2dsphere'}
	loc: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [Number]
	},
	city: String,
	state: String
});

BarSchema.index({loc: '2dsphere'});

module.exports = mongoose.model('Bar', BarSchema);