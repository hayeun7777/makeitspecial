var express = require('express');
var db = require('../models');
var router = express.Router();
var request = require('request');

require('dotenv').config();

//display Etsy goods related to tag keywords
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


//Delete tags when the entire friend list is removed
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


//Delete only tags in the edit page
router.delete('/edit/:id', function(req, res){
	db.tag.destroy({
		where: {id: req.params.id}
	})
	.then(function(deletedFriend){
		db.friendTag.destroy({
			where: {
			tagId: req.params.id
			}
		}).then(function(deletedAssociations){
			res.redirect('/friend/edit');
		}).catch(function(err){
			console.log(err);
		})
	})
})


module.exports = router;