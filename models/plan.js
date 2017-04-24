var mongoose= require('mongoose');

var Plan= mongoose.Schema({
	PlanID: Number,
	PlanType: String,
	Price: Number,
	Calls: Number,
	Messages: Number,
	Internet : Number,
	Validity: Number
});

module.exports= mongoose.model('Plan',Plan);