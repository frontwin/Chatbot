var mongoose= require('mongoose');
var Plan = require('./plan.js');
var Schema = mongoose.Schema;

var Call = require("./call.js");

var chatUser= new mongoose.Schema({
		profileID: Number,
		fullname: String,
		profilePic: String,
		gender: String,
		email:String,
		Type: String,
		message :[{
					content: String,
					time: { type: Date, default: Date.now },
					from : String,
					to :String
				}],
		bill:[{
					billID: Number,
					billingDate: {type: Date},
					planID: { type: Schema.Types.ObjectId, ref: 'Plan'},
					totalCall : Number,
					totalBill: Number,
					totalMessages:Number,
					internetUsage: Number,

			 }],
		CallHistory:[{
			phone: Number,
			type: String,
			seconds: Number,
			//stamp: { type: Date ,default: Date.now}
		}]
	});

module.exports = mongoose.model('User', chatUser); 

