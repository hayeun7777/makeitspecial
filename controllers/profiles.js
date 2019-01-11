var express = require('express');
var router = express.Router();

//include my middleware so that users can't access this page without loggingin
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

router.get('/', loggedIn, function(req,res){
	res.render('/profile');
});

router.get('/admins', isAdmin, function(req, res){
	res.render('admin');
})

module.exports = router;