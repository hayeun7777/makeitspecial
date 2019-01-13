var express = require('express');
var router = express.Router();
var db = require('../models'); 
var scraper = require('../scraper')

router.get('/', function(req, res){
	scraper.showGift(req.body)
	.then(function(gifts){
		console.log(gifts)
		//res.render('products/show', {gifts : gifts});
	})
})

// router.get('/', function(req, res){
// 	db.gift.findAll().then(function(gifts) {
// 	    res.render('products/show', { gifts: gifts });
//  	});
// })

module.exports = router;
