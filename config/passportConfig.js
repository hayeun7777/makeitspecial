//require passport module and any strategies you wish to use
var passport = require('passport');
var localStrategy = require('passport-local').Strategy; 

//a reference to our models
var db = require('../models');

//provide serialize/deserialize functions so we can store user in session
passport.serializeUser(function(user, callback){
//callback(errorMessage, userData)
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback){
	db.user.findByPk(id)
	.then(function(user){
		callback(null, user);
	})
	.catch(function(err){
		callback(err, null);
	});
});

//Do the actual logging in (authentication)
passport.use(new localStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, function(username, password, callback){
	//find the user with the username
	db.user.findOne({
		where: {username: username}
	})
	.then(function(foundUser){
		//if I didn't find a valid user or that user's password, once hashed, doesn't match the hash in the db
		if(!foundUser || !foundUser.validPassword(password)){
			//bad
			callback(null, null);
		}
		else{
			//good
			callback(null, foundUser);
		}

	})
	.catch(function(err){
		callback(err, null);
	});
}));

//Make sure I can include this module in other pages in my app
module.exports = passport;