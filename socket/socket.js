module.exports = function (io,mongoose,userModel,natural,pos,Nexmo,app,express) {
var clients=0;

const nexmo = new Nexmo({
  apiKey: '4e65dbd7',
  apiSecret: 'd91c061d8dbc1b05'
});

var router= express.Router();
var number=919899472705;

var ans=[];

natural.PorterStemmer.attach();

var classifier = new natural.BayesClassifier();
var classifier2 = new natural.BayesClassifier();
classifier.addDocument('send me a message to my number,please message me now ','mess');

classifier.addDocument('hello hi hiii wassup hey ello miss hey there! howdy namaste good morning good night good evening good afternoon goodmorning goodafternoon goodevening ','iGreet');

classifier.addDocument('my name is xyz, pleased to meet you. how are you.how have you been. good to see you. nice to meet you. What a lovely day it is! I need help. Please help me out','greet2');

classifier.addDocument('bot dude, you are awesome cool. You are so much fun and its nice to chat with you. awesome nice good excellent','appreciation');

classifier.addDocument('you are not as good  bad as we thought. Quite okayish. not upto the mark.  i would even say bad and worst. disgusting you are stupid and worthless!','critics');

classifier.addDocument('I would like to know about the weather today!','question1');
classifier.addDocument('What is my bill for the last two months?','question1');
classifier.addDocument('How do you do this? How do you do that? What is the procedure to do this?','question1');

classifier.addDocument('ok, thank you so much for your answer. you are awesome. Beautiful','regard1');
classifier.addDocument('That was quite helpful. Thank you, you are a genius.','regard1');

classifier.addDocument('good bye, good night, goodnight, see you later. Bye take care.','bye1');
classifier.addDocument('Have a great day, Farewell. i am off. i\'m off. i am out. i\'m out. later. see ya. see you.','bye1');

classifier2.addDocument('give me my call details, my call usage , how much calls i have made','calling');
classifier2.addDocument('Can you please give me the bill of last 3 months?','bill1');
classifier2.addDocument('what has been my bill in the last. How much have i spent on my phone. Please tell me. Show me. Let me know how much..','bill1');
classifier2.addDocument('How much do I spend on my data plan? how much internet i availed tell me my internet details give me Can show me how much data I have used in this month!','bill2');

classifier2.train();
classifier.train();

function checkClass(inputStatement2,user_id,name,socket)
{		
	var inputStatement=inputStatement2.toString();
	var words = new pos.Lexer().lex(inputStatement);
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag(words);
	var query=classifier.classify(inputStatement);
	var flag=0;
	
	if(query=='iGreet')
	{		
		var r_string='Hello ' +name +'.How may I help you?';
		ans.push('iGreet');

		socket.emit("reply",r_string);
	}
	//query =classifier.classify('my name is umang, and i need your help');
	else if(query=='greet2')
	{
		var r_string='hello '+name+' . Nice to meet you. Any question you want to ask?';
		ans.push('greet2');
		socket.emit("reply",r_string);
	}
	//query=classifier.classify('what is the bill of last two months from my account');
	else if(query=='question1')
	{
		var query2=classifier2.classify(inputStatement);	
	//	console.log('nice question. Let me look it up for you..');
		if(query2=='bill1')
		{ans.push('question1');
			
			var r_strin='nice question. Let me look it up for you..';
			socket.emit("reply",r_strin);
	
			for (var i in taggedWords) 
			{
			    var taggedWord = taggedWords[i];
			    var word = taggedWord[0];
			    var tag = taggedWord[1];
			   
			    if(tag=='CD' && flag==0)
			    {	         
			    	var a;
			    	var num=word;

						userModel.find({'profileID':user_id},function(err,user)
						{
							
						var bills  = [];

							for (var i = user[0].bill.length - 1; i >= 0; i--) 
							{
								var bdate = (user[0].bill[i]["billingDate"]).getMonth();
								var cdate = new Date().getMonth();

								
								var bill_deatil={};
								
								bill_deatil.total = user[0].bill[i].totalBill;
								bill_deatil.call = user[0].bill[i].totalCall;
								bill_deatil.internet= user[0].bill[i].internetUsage;
								bill_deatil.message =user[0].bill[i].totalMessages;
								
								// console.log(bill_deatil);
								
								// console.log(cdate);
								// console.log(bdate);

								var c= parseInt(cdate);
								var b= parseInt(bdate);
								
								var a=c-b;
								// console.log(a);
								// //console.log(parseInt(word));
								// console.log("****************");

								//console.log(a<parseInt(word));
								// console.log(num);
								// console.log(typeof(num));
								var cmp=num.toString();
								// console.log(typeof(cmp));
								var ncmp =parseInt(cmp);

								// console.log(typeof(ncmp));
								// console.log("printing cmp" + cmp);

								if( a < ncmp )
								{	console.log("inside if cond");
									bills.push(bill_deatil);
									console.log("bill is eligible");

								}


							}	

								console.log("emitting bills");
								console.log(bills);
								socket.emit("billdetails",{"details" :bills});
							// for(i=0;i<bills.length;i++)
							// {
							// 	console.log(bills[i]);
							// }
						
						// console.log("in calbill" + user);
							// return (a=user);

						//socket.emit("reply",{"user" :user});
			
						});
		
			    	console.log('Your bill for the last '+num+' months is as follows:');
			    	flag=1;
			    }
			}
			if(flag==0)
			{	var r_string='Just a minute sir';
			socket.emit("reply",r_string);
	

			ans.push('question1');

						var a;
			    	var num=word;
			    			var bills=[];

						userModel.find({'profileID':user_id},function(err,user)
						{	console.log("////////");
								//console.log(user);
								var bill_deatil={};
								bill_deatil.total = user[0].bill[0].totalBill;
								bill_deatil.call = user[0].bill[0].totalCall;
								bill_deatil.internet= user[0].bill[0].internetUsage;
								bill_deatil.message =user[0].bill[0].totalMessages;
								console.log(bill_deatil);
								bills.push(bill_deatil);
							
								socket.emit("billdetails",{"details" :bills });
						});	
						

				console.log("Your bill of last month is:s");
			}


		}
		///////very verry important
		else if(query2=='bill2')
		{
			var r_string = 'your data usage is ';
			ans.push('bill2');
			ans.push('question1');

						userModel.find({'profileID': user_id },function(err,user){
							if(err){
								console.log(err);
							}
							else{
								console.log("giving internet usage");
								r_string+= user[0].bill[0].internetUsage + 'gb' ;
								socket.emit("reply",r_string);

							}
						});


		}
		else if(query2=='calling'){
			var r_string = 'Your call usage is ';
			ans.push('calling');
			ans.push('question1');

						userModel.find({'profileID': user_id },function(err,user){
							if(err){
								console.log(err);
							}
							else{
								console.log("giving internet usage");
								r_string+= user[0].bill[0].totalCall + ' minutes' ;
								socket.emit("reply",r_string);

							}
						});
		}
		
	}
	else if(query=='regard1')
	{
		var r_string = 'Thank you sir' ;
		ans.push('regard1');
		socket.emit("reply",r_string);
	}

	else if(query=='mess')
	{ 
	console.log("in message class sending message");
  
			
  		var toNumber = 919899472705;
  		var message = " hello" + name; 

  		
  		nexmo.message.sendSms(
    	number, toNumber, message, {type: 'unicode'},
    		(err, responseData) => {
    		
		console.log("in message class sending message");
      		if(err){
    				console.log(err);
    			}

    		if (responseData) {
    		console.log(responseData);

			var r_string="Message sent. Please check your phone with number 9899472705 " ;
			socket.emit("reply",r_string);

    		}
    	});

		
	}
	else if(query=='bye1')
	{
		//console.log('Bye, have a nice day!');
		var r_string = 'Bye, have a nice day. Nice talking to you :)';
		ans.push('bye1');
		socket.emit("reply",r_string);
	}
	else if(query=='appreciation')
	{
		//console.log('Thank You so much sir. You are very kind.');
		var r_string = 'Thankyou i am always there to help you' + name+' :)';
		
		ans.push('appreciation');
		socket.emit("reply",r_string);
	}
	else if(query=='critics')
	{
		//console.log('I am sorry sir, but I will learn with time. You can also help me improve by teaching me. Input the sentence and class you want me to learn about..');
		var r_string = 'I am sorry sir, but I will learn with time. You can also help me improve by teaching me. Input the sentence and class you want me to learn about..';
		
		ans.push('critics');
		socket.emit("reply",r_string);
	}
	else
	{
		//console.log('Those are strange things. That\'s out of my syllabus. \nThe list of things I can do is.. ');
		var r_string ='Those are strange things. That\'s out of my syllabus. \nThe list of things I can do is.. ';
		socket.emit("reply",r_string);
	}
}


	io.on('connection',function(socket){
		clients++;
		console.log('A new user is connected');
		console.log("total number of clients are" + clients);
		io.sockets.emit('broadcast',"Total users online are" + clients);

		
		socket.on('userquery',function(data){

			checkClass(data.query,data.user,data.name,socket);

	////////////////////////////////////HELLO QUERY//////////////////////////////////
			// if(data.query=="hello"){
			// 	userModel.findOneAndUpdate({'profileID':data.user}, {$push: {"message": {content: data.query, from:"user", to:"server"} } }, function(err, user){
 
   //  			if (err)
   //  				{
   //    					console.log('There was an error adding message to db');
   //    					throw err
   //  				}
   // 				if  (!user)
   // 					{
   //    					res.status(401).send('No user with that username');
   //  				}
   //  		 	else{
   //  		 	 		console.log("*************");
   //    					console.log( user);
   //    					console.log("*************");
   //    				}
  	// 			});

			// 	socket.emit("reply","hello" +data.user);


			// }
	/////////////////////////Bill query////////////////////////////////////////		
			// else if(data.query=="bill")
			// {
				
			// 	calbill(data.user,socket);
				
			// }
			// else{
			// 		console.log(data.query);
			// 		console.log(data.user);
			// 	}
		});
		
		socket.on('disconnect',function(){
			clients--;

		io.sockets.emit('broadcast',"Total users online are" + clients);
		console.log("total number of clients are" + clients);
			console.log("An old user left");
		});

	});
}