var express = require('express');
var passport = require('../config/passportConfig');
var router = express.Router();
var db = require('../models'); //we are in controllers folder so need ../

router.get('/login', function(req, res){
	res.render('auth/login');
})

router.post('/login', passport.authenticate('local',{
	successRedirect: '/profile',
	successFlash: 'Yay, login successful',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid Credentials'
}));

router.get('/signup', function(req, res){
	res.render('auth/signup', {previousData: null});
})

//use relative path here
router.post('/signup', function(req, res, next){
	if(req.body.password != req.body.password_verify){
		req.flash('error', 'Passwords must match');
		res.render('/auth/signup', {previousData: req.body , alerts: req.flash() }); //absolute path here. where you want to redirect users to
	} else {
		db.user.findOrCreate({
			where: { username: req.body.username },
			defaults: req.body 
		})
		.spread(function(user, wasCreated){
			//console.log('got to promise');
			if(wasCreated){
				passport.authenticate('local', {
					successFlash: 'Welcome Home',
					successRedirect: '/profile',
					failureFlash: 'Invalid Credentials',
					failureRedirect: '/auth/login'
				})(req, res, next);
			}
			else{
			//	console.log('was found'); //good habit to console.log to see if things work
				req.flash('error', 'Username already in use');
				//(type, message)
				res.render('auth/signup', {previousData: req.body, alerts: req.flash() }); //redirect to signup page for redo the fill-out
			}
		})
		.catch(function(err){
			//there could be multiple errors. i.e. errors from an error branch
			if(err && err.errors){
				err.errors.forEach(function(e){
					if(e.type == 'Validation error'){
						req.flash('error', 'Validation Error: ' + e.message);
					}
					else{
						console.log('Error (not validation)', e);
					}
				})
			}
			res.render('auth/signup', {previousData: req.body, alerts: req.flash() }); //redirecting and pass everything but the password
			//res.render('error'); //render to an error page under view folder
		});
	}
});

router.get('/logout', function(req,res){
	req.logout(); //logs me out of the session
	req.flash('success', 'Successful Logout! Come back again!');
	res.redirect('/');
});

module.exports = router;