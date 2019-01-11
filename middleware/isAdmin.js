//this is a page that prevents a user to have an access to profile page without logging in
module.exports = function(req, res, next){
	if(req.user && req.user.admin){
		next();
	}	
	else{
		req.flash('error', 'Only admins can access this page!');
		res.redirect('/profile');
	}
}