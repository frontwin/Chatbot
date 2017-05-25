var express = require('express');
var app= express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config= require('./config/config.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
const Nexmo = require('nexmo');
var nodemailer = require('nodemailer');
var async = require('async');

const nexmo = new Nexmo({
  apiKey: '4e65dbd7',
  apiSecret: 'd91c061d8dbc1b05'
});

var FacebookStrategy = require('passport-facebook').Strategy;


var natural = require('natural');
var pos = require('pos');



mongoose.connect(config.dbURL,function(err){
	if(err){
		console.log("databse error occured");
	}
	else{

	console.log("databse connected");
	
	}
});
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());
 
var User = require('./models/userSchema.js');
var Plan = require('./models/plan.js');
var Call = require('./models/call.js');
var Offer = require('./models/offers.js');

var ConnectMongo = require('connect-Mongo')(session);

app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');

app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser()); 

var env = process.env.NODE_ENV || 'development';

if(env == 'development'){


app.use(session({
	secret: config.sessionSecret ,
	store : new ConnectMongo({
		url : config.dbURL,
		stringify : true
		}),
	}));
}else{

app.use(session({
	secret: config.sessionSecret ,
	store : new ConnectMongo({
		url : config.dbURL,
		stringify : true
		}),
	}));
}
app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport,FacebookStrategy,config,User);
require('./routes/routes.js')(app,express,passport,Plan,User,Call,Offer);


app.set('port',process.env.PORT || 3000);

var server = require('http').createServer(app);
var io= require('socket.io').listen(server);

require('./socket/socket.js')(io,mongoose,User,natural,pos,Nexmo,app,express,nodemailer,Plan,Offer);

server.listen(app.get('port'),function(){
	console.log('Mode is : ' + env);
	console.log("server is running at "+ app.get('port'));
});



