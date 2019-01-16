var express = require('express');
var db = require('../models');
var router = express.Router();
var request = require('request');

require('dotenv').config();

// router.get('/', function(req, res){
// 	db.tag.findAll()
// 	.then(function(tags){
// 		res.render('tags/index', { tags: tags });
// 	})
// 	.catch(function(err){
// 		console.log(err);
// 	})
// });

// router.get('/:id', function(req, res){
// 	db.tag.find({
// 		where: { id: req.params.id },
// 		include: [db.friend]
// 	})
// 	.then(function(tag){
// 		res.render('tags/show', { tag: tag });
// 	})
// 	.catch(function(err){
// 		console.log(err);
// 	})
// })


router.get('/:content', function(req, res){
var urlToCall = process.env.ETSY_URL + '&keywords=' + req.params.content + '&includes=Images';
	request(urlToCall, function(err, response, body){
		if(err){
			console.log(err);
		} else{
			var result = JSON.parse(body).results;
			console.log(result);
			res.render('tags/show', {result: result, tag: req.params.content})
		}
	})
})


//Delete the friends
router.delete('/:id', function(req, res){
	db.tag.destroy({
		where: {id: req.params.id}
	})
	.then(function(deletedFriend){
		db.friendTag.destroy({
			where: {
			tagId: req.params.id
			}
		}).then(function(deletedAssociations){
			res.redirect('/friend');
		}).catch(function(err){
			console.log(err);
		})
	})
})


module.exports = router;