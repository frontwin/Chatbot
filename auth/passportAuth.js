
module.exports=function (passport,FacebookStrategy,config,userModel) {


	

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	userModel.findById(id,function(err,user){
		done(err,user);
	});
});


	passport.use(new FacebookStrategy({
		clientID: config.fb.appID,
		clientSecret: config.fb.appSecret,
		callbackURL: config.fb.callbackURL,
		profileFields:['id','displayName','photos','hometown','gender','email']
	},function(accessToken,refreshToken,profile,done){


		userModel.findOne({'profileID' : profile.id},function(err,result){
			
		if(err){
			console.log(err);
		}
			if(result){
				return done(null,result);
			}
			else{ 
				
				var newChatUser= new userModel();

				newChatUser.profileID = profile.id;//d
				newChatUser.fullname = profile.displayName;///d
				newChatUser.profilePic = profile.photos[0].value || '';//d
				newChatUser.gender=profile.gender;//d
				newChatUser.hometown=profile.hometown;
			
				newChatUser.birthday= profile.birthday;


				newChatUser.save(function(err){
				
					return done(null,newChatUser);
				});
			}
		});

	}));

}
