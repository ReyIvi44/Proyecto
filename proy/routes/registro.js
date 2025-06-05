var express = require('express');
var router = express.Router();
const passport = require("passport");

// Renderiza una vita a partir de la plantilla iniciosesion.ejs
router.get('/', (req, res) => {
  res.render('registro', {
    message: req.flash('signupMessage')
  });
});
// Se hace uso de passport para crear una nueva cuenta, de forma que si lo que se añade en el formulario es valido, se crea una cuenta nueva
router.post('/', passport.authenticate('local-registro', {
  successRedirect: '/', //Si es correcto se redirige al inicio
  failureRedirect: '/registro', //Si no lo es vuelve a cargar iniciosesion
  failureFlash: true
}));


module.exports = router;