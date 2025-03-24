const express = require('express');
const router = express.Router();
const passport = require("passport");

// Definir las rutas aquí
router.get('/', (req, res) => {
  res.render('registro.ejs', {
    message: req.flash('signupMessage')
  });
});

router.post('/', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/iniciosesion', //por ahora no tenemos view de signup, por lo que no funciona el redirect
  failureFlash: true // allow flash messages
}));


module.exports = router;