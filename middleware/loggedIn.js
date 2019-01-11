//this is a page that prevents a user to have an access to profile page without logging in
module.exports = function(req, res, next){
	if(req.user){
		next();
	}	
	else{
		req.flash('error', 'Please login to access this page!');
		res.redirect('/auth/login');
	}
}