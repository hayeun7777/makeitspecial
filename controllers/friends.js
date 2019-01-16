var async = require('async');
var express = require('express');
var router = express.Router();
var db = require('../models'); 
var tags = [];

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
		res.render('friends/more', {friend: friend});
	})
	.catch(function(err){
		console.log(err);
	})
})

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

//add tags on the edit page HELP
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
				console.log('redirecting');
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

//Delete association from the edit page
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

//Delete association
router.delete('/', function(req, res){
	db.friendTag.destroy({
		where: {
			friendId: req.body.friendId,
			tagId: req.body.tagId
		}
	})
	.then(function(deletedAssociations){
		res.redirect('/friend');
	})
})

//Delete a friend (including tags)
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