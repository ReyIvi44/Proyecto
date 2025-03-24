const express = require('express');
const router = express.Router();
const passport = require("passport");

// Definir las rutas aquí
router.get('/', (req, res) => {
  res.render('iniciosesion.ejs', {
  });
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


module.exports = router;