var express = require('express');
var router = express.Router();
const passport = require("passport");



    // Renderiza una vita a partir de la plantilla iniciosesion.ejs
    router.get('/', (req, res) => {
        res.render('iniciosesion.ejs', {
      message:""
        });
    });
    // Procesa el formulario, verifica el usuario y la contraseña
    router.post('/', passport.authenticate('local-iniciosesion', {
        successRedirect: '/', //Si es correcto se redirige al inicio
        failureRedirect: '/iniciosesion', //Si no lo es vuelve a cargar iniciosesion
        failureFlash: true
    }));


module.exports = router;