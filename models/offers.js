var mongoose= require('mongoose');

var Offer= mongoose.Schema({
	OfferId: Number,
	Offertype: String,
	Detail: String,
	Link: String 
	});

module.exports= mongoose.model('Offer',Offer);