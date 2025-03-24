const express = require('express');
const router = express.Router();

// Definir las rutas aquí
router.get('/', (req, res) => {
  res.render('iniciosesion.ejs', {
  });
});


module.exports = router;