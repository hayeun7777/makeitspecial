var express = require('express');
var router = express.Router();
var db = require('../models'); 

//include my middleware so that users can't access this page without loggingin
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

router.get('/', loggedIn, function(req,res){
	res.render('/profile');
});

router.get('/edit/:id', loggedIn, function(req,res){
	db.user.findByPk(req.params.id)
	.then(function(user){
		res.render('proedit/edit');		
	})
	.catch(function(err){
		console.log(err);
	})
});

router.put('/:id', loggedIn, function(req, res){
	db.user.update({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		dob: req.body.dob,
		image: req.body.image,
		bio: req.body.bio
	},{
		returning: true,
		where: {id:req.params.id}
	}).then(function([rows, [updatedUser]]){
		res.redirect('/profile')
	}).catch(function(err){
		console.log(err);
	})
})

router.get('/admins', isAdmin, function(req, res){
	res.render('admin');
})

module.exports = router;