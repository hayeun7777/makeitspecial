var async = require('async');
var express = require('express');
var router = express.Router();
var db = require('../models'); 


router.get('/', function(req, res){
	db.friend.findAll({
		where: { userId: req.user.id },
		include: [db.user]
	})
	.then(function(friends){
		res.render('calendars/view', { friends : friends});
	})
	.catch(function(err){
		console.log(err);
	})
})

module.exports = router;