const express = require('express');
const router = express.Router();

// Definir las rutas aquí
router.get('/', (req, res) => {
  res.render('registro.ejs', {
  });
});


module.exports = router;