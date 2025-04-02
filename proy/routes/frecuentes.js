var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.render('frecuentes', { 
        title: 'Preguntas Frecuentes', 
        user: req.user || null // Asegurarse de pasar "user" o null si no hay sesión
    });
});


module.exports = router;