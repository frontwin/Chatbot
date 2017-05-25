module.exports= function (app,express,passport,Plan,User,Call,Offer) {
	
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

	router.get('/udet',function(req,res){
		User
		.findOne({fullname:"Sharang Malhotra"})
		.populate('bill.planID')
		.exec(function(err,user){
			res.json(user);
		})
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

	router.get('/getoffers',function(req,res){

		Offer.find({},function(err,offer){
			res.json(offer);
		})
	})
	
	router.get('/addbill',function(req,res,next){
		res.render('addbills');
	})

	router.get('/lessplan',function(req,res){
		Plan
		.find({Price:{ $lt:500}},function(err,plans){
			if(err){
				console.log(err);
				return;
			}
			res.json(plans);
		});



	});


	router.post('/addOffer',function(req,res){
		
		var offer= new Offer(req.body);
		
		offer.save(function(err){
			if(err){
				console.log(err);
				return;
			}
			console.log("offer is saved");
			res.json({"done":"done"});
		});


	});


	// router.get('/addcall',function(req,res){
			
	// 		var mbl=['9899472733','9837043334','6655448834','0987656787'];
	// 		var c_type=['ISD','STD','LOCAL','TOLL-FREE'];

	// 		console.log(req.user.profileID+"*******");
	// 					//var match=req.user.profileID;

	// 			var index= parseInt(Math.floor(Math.random()*4));
	// 			var number1=parseInt(mbl[index]);
	// 			console.log(typeof number1);
	// 			console.log(number1);
	// 			var type1 = c_type[index];
	// 			console.log(typeof type1);
	// 			console.log(type1);

	// 			var seconds1= parseInt(Math.floor((Math.random()*900)+100));




	// 		User.findOneAndUpdate({'profileID':req.user.profileID}, {$push: {"CallHistory": { phone:number1 , type:type1 ,seconds:seconds1 } }  }, function(err, user){
 		
 //    		if (err){
 //      			console.log('There was an error adding call to db');
 //      			throw err
 //    				}

 //   			if  (!user) {
      			
 //      			res.status(401).send('No user with that username');
    			
 //    			}
 //    		 else{
 //    		 	 	console.log("*************");
 //      				console.log( user);
 //      				console.log("call added to databse *************");
 //      				res.json(user);
      			
 //    			 }
 //  				});

					
						
						
						

	// 				});


	router.post('/makebill',securePages,function(req,res,next)
	{


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