var async = require('async');
var express = require('express');
var router = express.Router();
var db = require('../models'); 
var request = require('request');

require('dotenv').config();

var tags = [];

//get all the list of friends
router.get('/', function(req, res){
	db.friend.findAll({
		where: { userId: req.user.id },
		include: [db.tag, db.user]
	})
	.then(function(friends){
		res.render('friends/show', { friends: friends });
	})
	.catch(function(err){
		console.log(err);
	})
})

//post new friends and tags
router.post('/', function(req, res){
	if(req.body.tags){
    tags = req.body.tags.split(",");
	}
		db.friend.create({
			friendname: req.body.friendname,
			date: req.body.date,
			event: req.body.event,
			userId: req.body.userId
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

//get items related to tag content on the friend/more page per friendId
router.get('/:id', function(req, res){
	db.friend.findOne({
			where: {id: req.params.id},
			include: [db.tag]
		})
		.then(function(friend){	
			async.map(friend.tags, requestGifts, function(err, results) {
			    res.render('friends/more', {friend: friend, results: results});
			});
		})
		.catch(function(err){
			console.log(err);
		})
});

//edit friend profile 
router.get('/edit/:id', function(req, res){
	db.friend.findOne({
		where: {id: req.params.id},
		include: [db.tag]
	})
	.then(function(friend){
		res.render('friends/edit', {friend : friend});
	}).catch(function(err){
		console.log(err);
	})
})

//add tags on the edit page
router.post('/edit/:id', function(req, res){
	if(req.body.tags){
    	tags = req.body.tags.split(",");
	}
	if(tags.length>0){
		db.friend.findOne({
			where: {id: req.params.id},
			include: [db.tag]
		})
		.then(function(friend){
	    	async.forEach(tags, function(t, done){
				db.tag.findOrCreate({
	  				where:{ content: t.trim() }  
				})
				.spread(function(newTag, wasCreated){
	  				friend.addTag(newTag)
		  			.then(function(){
		    			done(); //call done when finished
		  			}).catch(done);
				})
				.catch(done);
			}, function(){
				res.redirect('/friend/edit/' + req.params.id);
			});
		});
	}
	else {
		res.redirect('/friend/edit/' + req.params.id);
	}
});

//update friend profile and redirect to '/friend' -> WORKING
router.put('/:id', function(req, res){
	db.friend.update({
		friendname: req.body.friendname,
		date: req.body.date,
		event: req.body.event
	}, {
		returning:true,
		where: {id: req.params.id}
	}).then(function([rows, [updatedFriend]]){
		res.redirect('/friend')
	}).catch(function(err){
		console.log(err);
	})
})

//Delete association when deleting tags in the edit page
router.delete('/edit/:id', function(req, res){
	db.friendTag.destroy({
		where: {
			friendId: req.body.friendId,
			tagId: req.params.id
		}
	})
	.then(function(deletedAssociations){
		res.redirect('/friend/edit/' + req.body.friendId );
	})
})

//Delete association when deleting the entire friend list
router.delete('/', function(req, res){
	db.friendTag.destroy({
		where: {
			friendId: req.body,friendId,
			tagId: req.params.id
		}
	})
	.then(function(deletedAssociations){
		res.redirect('/friend');
	})
})

//Delete a friend (including tags)
router.delete('/:id', function(req, res){
	db.friend.destroy({
		where: {id: req.params.id,
		userId: req.user.id}
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

function requestGifts(tag, callback){
	let urlToCall = process.env.ETSY_URL + "&keywords=" + tag.content + "&includes=Images" + "&limit=16";
	request(urlToCall, function(err, response, body){
		if(err){
			console.log(err)
		} else {
			let result = JSON.parse(body).results;
			callback(null, {tag: tag, gifts: result});
		}
	})
}

module.exports = router;