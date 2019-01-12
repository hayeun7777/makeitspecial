var db = require('./models');

//test the 1 user to many parties
// db.user.create({
// 	firstname: "Bob",
// 	lastname: "Bobbington",
// 	email: "bob@bobbington.com",
// 	password: "bobbington",
// 	username: "bobbingbobbington",
// 	dob: new Date('11/01/1992'),
// 	bio: "I am a test dummy",
// 	image: "http://placekitten.com/200/300"
// }).then(function(user){
// 	db.party.create({
// 		userId: user.id,
// 		name: "Bob's birthday",
// 		date: new Date(),
// 		numClowns: 2
// 	}).then(function(party){
// 		console.log("Bob's birthday is set up!");
// 	})
// }).catch(function(err){
// 	console.log("oh no there was an error see below:");
// 	console.log(err);
// })

//test the many clowns to many parties
db.clown.create({
	name: "Chuckles",
	email: "heheh@heh.com",
	perHr: 65,
}).then(function(clown){
	db.party.findOne({
		where: {
			name: "Bob's birthday"
		}
	}).then(function(bobsParty){
		bobsParty.addClown(clown);
	});
}).catch(function(err){
	console.log("here is the error", err);
})