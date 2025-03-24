var express = require('express');
var router = express.Router();
const passport = require("passport");

/* GET users listing. */
	
	// login view
	router.get('/', (req, res) => {
		res.render('iniciosesion', {
			//message: req.flash('loginMessage')
      message:""
		});
	});

	router.post('/', passport.authenticate('local-iniciosesion', {
		successRedirect: '/',
		failureRedirect: '/iniciosesion',
		failureFlash: true
	}));


module.exports = router;