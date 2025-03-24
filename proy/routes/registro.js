var express = require('express');
var router = express.Router();
const passport = require("passport");

// Definir las rutas aquí
router.get('/', (req, res) => {
  res.render('registro', {
    message: req.flash('signupMessage')
  });
});

router.post('/', passport.authenticate('local-registro', {
  successRedirect: '/',
  failureRedirect: '/registro', //por ahora no tenemos view de signup, por lo que no funciona el redirect
  failureFlash: true // allow flash messages
}));


module.exports = router;