var Tools = require('./tools');
var config = require('./config');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/*
 * Passport configuration
 */
module.exports = function(app) {

	/* ------------------------------------------------------------ */
	// Local
	passport.use(new LocalStrategy(function(username, password, done) {
		var user = {
			displayName : auth.alone.username,
			email : auth.alone.email || ""
		};
		if (username.toLowerCase() != auth.alone.username.toLowerCase()
				|| Tools.hashify(password) != auth.alone.passwordHash) {
			return done(null, false, {
				message : 'Incorrect username or password'
			});
		}
		return done(null, user);
	}));
	app.post("/login", passport.authenticate('local', {
		successRedirect : '/auth/done',
		failureRedirect : '/login',
		failureFlash : true
	}));

	/* ------------------------------------------------------------ */
	// Google-based
	passport.use(new GoogleStrategy({
		returnURL : app.locals.baseUrl + '/auth/google/return',
		realm : app.locals.baseUrl
	}, function(identifier, profile, done) {
		done(undefined, profile);
	}));
	app.get("/auth/google", passport.authenticate('google'));
	app.get("/auth/google/return", passport.authenticate('google', {
		successRedirect : '/auth/done',
		failureRedirect : '/login'
	}));

	/* ------------------------------------------------------------ */
	// Twitter-based
	var twitterConfig = config.authentication.twitter;
	if (twitterConfig.oauthkeys) {
		passport.use(new TwitterStrategy({
			consumerKey : twitterConfig.oauthkeys.consumerKey,
			consumerSecret : twitterConfig.oauthkeys.consumerSecret,
			callbackURL : app.locals.baseUrl + '/auth/twitter/return'
		}, function(token, tokenSecret, profile, done) {
			var user = {
				displayName : profile.displayName,
				// FIXME
				email : profile.displayName + '@test.com'
			};
			return done(undefined, user);
		}));
		app.get("/auth/twitter", passport.authenticate('twitter'));
		app.get("/auth/twitter/return", passport.authenticate('twitter', {
			successRedirect : '/auth/done',
			failureRedirect : '/login'
		}));
	}

	/* ------------------------------------------------------------ */
	var facebookConfig = config.authentication.facebook;
	if (facebookConfig.oauthkeys) {
		passport.use(new FacebookStrategy({
			clientID : facebookConfig.oauthkeys.clientID,
			clientSecret : facebookConfig.oauthkeys.clientSecret,
			callbackURL : app.locals.baseUrl + '/auth/facebook/return'
		}, function(accessToken, refreshToken, profile, done) {
			var user = {
				displayName : profile.displayName,
				// FIXME
				email : profile.displayName + '@test.com'
			};
			return done(undefined, user);
		}));
		app.get("/auth/facebook", passport.authenticate('facebook'));
		app.get("/auth/facebook/return", passport.authenticate('facebook', {
			successRedirect : '/auth/done',
			failureRedirect : '/login'
		}));
	}

	/* ------------------------------------------------------------ */
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	/* ------------------------------------------------------------ */
	passport.deserializeUser(function(user, done) {
		if (user.emails && user.emails.length > 0) { // Google
			user.email = user.emails[0].value;
			delete user.emails;
		}
		user.asGitAuthor = user.displayName + " <" + user.email + ">";
		done(undefined, user);
	});

	/* ------------------------------------------------------------ */
	// var auth = app.locals.authentication = config.authentications
	var auth = app.locals.authentication = config.authentication;
	
	//
	// var authEnabled = false;
	// for ( var n in config.authentications) {
	// authEnabled |= config.authentications[n].enabled;
	// }
	// if (!authEnabled) {
	// console
	// .log("Error: no authentication method provided. Cannot continue.");
	// process.exit(-1);
	// }

};