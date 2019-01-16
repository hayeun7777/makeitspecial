var async = require('async');
var express = require('express');
var router = express.Router();
var db = require('../models'); 

//get all the list of friends
router.get('/', function(req, res){
	db.friend.findAll({
		include: [db.tag]
	})
	.then(function(friends){
		res.render('friends/show', { friends: friends});
	})
	.catch(function(err){
		console.log(err);
	})
})

//post new friends and tags
router.post('/', function(req, res){
	var tags = [];
	if(req.body.tags){
    tags = req.body.tags.split(",");
	}
		db.friend.create({
			friendname: req.body.friendname,
			date: req.body.date,
			event: req.body.event
		})
		.then(function(friend){
			if(tags.length>0){
    	    	async.forEach(tags, function(t, done){
        		db.tag.findOrCreate({
          			where:{ content: t.trim() } //trim() chops off white spaces around it 
        			})
        			.spread(function(newTag, wasCreated){
          				friend.addTag(newTag)
          			.then(function(){
            			done(); //call done when finished
          			}).catch(done);
        			})
        			.catch(done);
        		}, function(){
        			res.redirect('/friend');
        		});
			}
		})
	.catch(function(err){
		console.log(err);
	})
});

//get all list of friends with tags
router.get('/:id', function(req, res){
	db.friend.findOne({
		where: {id: req.params.id},
		include: [db.tag]
	})
	.then(function(friend){
		console.log("Hello world", friend.tags);
		res.render('friends/more', {friend: friend});
	})
	.catch(function(err){
		console.log(err);
	})
})


//Delete association
router.delete('/', function(req, res){
	db.friendTag.destroy({
		where: {
			friendId: req.body.friendId,
			tagId: req.body.tagId
		}
	})
	.then(function(deletedAssociations){
		res.redirect('/friend' );
	})
})

//Delete the friends
router.delete('/:id', function(req, res){
	db.friend.destroy({
		where: {id: req.params.id}
	})
	.then(function(deletedFriend){
		db.friendTag.destroy({
			where: {
			friendId: req.params.id
			}
		}).then(function(deletedAssociations){
			res.redirect('/friend');
		}).catch(function(err){
			console.log(err);
		})
	})
})


module.exports = router;