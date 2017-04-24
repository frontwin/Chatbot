var mongoose= require('mongoose');

var Call = mongoose.Schema({
				hours: Number,
				minutes: Number,
				seconds: Number,
});

module.exports= mongoose.model('Call',Call);