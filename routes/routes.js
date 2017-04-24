module.exports= function (app,express,passport,Plan,User,Call) {
	
	var router= express.Router();
	
	function securePages(req,res,next){
		if(req.isAuthenticated()){
			next();
		}else{
			res.redirect('/');
		}
	}

	router.get('/',function(req,res,next){
		
		if(!req.isAuthenticated()){
				res.render('home',{title:"Wipro Chatbot"});}
		else{
			res.redirect('/chat');
		}

	
	});

	

	router.get('/addplan',function(req,res,next){
		res.render('plan');
	});

	router.post('/makeplan',function(req,res,next){
		var newplan = new Plan(req.body);
		newplan.save(function(err){
			if(err){
				console.log(err);
			}
			else{
				console.log("plan saved to databse");
			}
		});
		res.json({success: " done"});
	});
	
	
	router.get('/addbill',function(req,res,next){
		res.render('addbills');
	})


	router.post('/makebill',securePages,function(req,res,next)
	{
		//console.log(req.user);
		// res.json({user : req.user});

		// User.findOne({"profileID": req.user.profileID}, function (err, user) {
    	//console.log(req.body);

  //   	user.bill.billID = req.body.billID;
  //   	user.bill.billingDate = req.body.billingDate;
  //   	user.bill.planID = req.body.planID;
  //   	user.bill.totalBill = req.body.totalBill;

  //   		var t_Call= new Call(); 
    	
  //   	t_Call.hours = req.body.hours;
  //   	t_Call.minutes = req.body.minutes;
  //   	t_Call.seconds = req.body.seconds;

  //   	user.bill.totalCall = t_Call;

  //   	user.bill.totalMessages = req.body.totalMessages;
  //   	user.bill.internetUsage = req.body.internetUsage;


  //  		user.save(function (err)
  //  		 {
  //       	if(err) 
  //       		{
  //       			console.error('ERROR!');
  //       		}
  //       		else{
  //       			res.json({"success":user });
  //       		}
  //   	});

		// });

		// user.bill.billID = req.body.billID;
  //   	user.bill.billingDate = req.body.billingDate;
  //   	user.bill.planID = req.body.planID;
  //   	user.bill.totalBill = req.body.totalBill;

  //   	// 	var t_Call= new Call(); 
    	
  //   	// t_Call.hours = req.body.hours;
  //   	// t_Call.minutes = req.body.minutes;
  //   	// t_Call.seconds = req.body.seconds;

  //   	// user.bill.totalCall = t_Call;

  //   	user.bill.totalMessages = req.body.totalMessages;
  //   	user.bill.internetUsage = req.body.internetUsage;,totalCall.hours :req.body.hours,totalCall.minutes :req.body.minutes ,totalCall.seconds : req.body.seconds


			User.findOneAndUpdate({'profileID':req.user.profileID}, {$push: {"bill": { billID:req.body.billID , billingDate :req.body.billingDate ,planID:req.body.planID,totalCall : req.body.totalCall, totalBill : req.body.totalBill, totalMessages : req.body.totalMessages, internetUsage : req.body.internetUsage
			} }  }, function(err, user){
 


		

    		if (err){
      			console.log('There was an error adding bill to db');
      			throw err
    				}

   			if  (!user) {
      			
      			res.status(401).send('No user with that username');
    			
    			}
    		 else{
    		 	 	console.log("*************");
      				console.log( user);
      				console.log("Bill added to databse *************");
      				res.json({'goog':"dfkjsd"});
      			
    			 }
  				});

	});

	router.get('/chat',securePages,function(req,res,next){
		console.log(req.user);
		res.render('chat',{title:"Welcome to Wipro Chatbot",user:req.user});

	});

	router.get('/auth/callback',passport.authenticate('facebook'));
	
	router.get('/auth/facebook/callback',passport.authenticate('facebook',{
		successRedirect: '/chat',
		failureRedirect: '/'
	}))

	router.get('/logout',function(req,res,next){
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);

}