var express = require('express');
var router = express.Router();

// Renderiza una vita a partir de la plantilla frecuentes.ejs
router.get('/', (req, res) => {
    res.render('frecuentes', { 
        title: 'Preguntas Frecuentes', 
        user: req.user || null 
    });
});


module.exports = router;