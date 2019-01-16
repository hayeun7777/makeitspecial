//load up env variables
require('dotenv').config();

// Requires
var parser = require('body-parser');
var flash = require('connect-flash');
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var passport = require('./config/passportConfig');
var session = require('express-session');
var methodOverride = require('method-override');

// Declare express app
var app = express();

// Declare a refernce to the models folder
var db = require('./models');

// Set views to EJS
app.set('view engine', 'ejs');

//use Middleware
app.use(methodOverride('_method'));
app.use(layouts);
app.use(parser.urlencoded({ extended: false}));
app.use('/', express.static('static'));
app.use(parser.urlencoded({ extended:false }));
//set up the session before firing the flash. flash depends on express-session
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//custom middleware - write data to locals
//this allows the entire webpage to have access to same data pool without repeating {alerts: req.flash();} for every GET, POST routes
app.use(function(req, res, next){//next is the callback to indicate we are ready to move to the next middleware
	res.locals.alerts = req.flash();
	res.locals.user = req.user;
	next();
});

// Declare routes
app.get('/', function(req, res){
  res.render('home');
});

app.get('/profile', function(req, res){
	res.render('profile'); //render profile.ejs file 
})

//include any controllers we need
app.use('/auth', require('./controllers/auth.js'));
app.use('/profile', require('./controllers/profiles'));
app.use('/product', require('./controllers/products'));
app.use('/friend', require('./controllers/friends'));
app.use('/tag', require('./controllers/tags'));
app.use('/calendar', require('./controllers/calendars'));

// Listen on a port
app.listen(3000);
