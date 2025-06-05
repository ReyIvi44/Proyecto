var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');


var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


// Renderiza una vita a partir de la plantilla index.ejs
router.get('/', async(req, res, next) =>{
  res.render('index', { title: 'Guadaway', user: req.user});
});


  const Ruta = require('../models/ruta');

// Esta en el index porque hace referencia a los datos de los popups de cada ruta en el mapa principal 
router.get('/geojson', async (req, res) => {
  try {
    const rutas = await Ruta.find();
    res.json(rutas);  // Devuelve las rutas como respuesta JSON
  } catch (error) {
    res.status(500).send('Error al obtener las rutas');
  }
});
module.exports = router;
// Se extraen los parametros enviados y se asignan a las variables para filtrar las rutas en la base de datos
router.get('/filtrar-rutas', async (req, res) => {
  const { maxDuracion, minDuracion, maxDistancia, minDistancia, dificultad, sentido } = req.query;

  const condiciones = {};
  // Se comprueba si minduracion cprresponde al valor minimo de duracion de la ruta y maxduracion a valor maximo
  if (minDuracion && maxDuracion) {
    condiciones['properties.Duración (h)'] = {
      $gte: parseFloat(minDuracion),
      $lte: parseFloat(maxDuracion)
    };
  }
  if (minDistancia && maxDistancia) {
    condiciones['properties.Longitud (km)'] = {
      $gte: parseFloat(minDistancia),
      $lte: parseFloat(maxDistancia)
    };
  }
  if (dificultad) { // Se verifica si se proporciona un valor para la dificultad y comprueba si el valor coincide con la ruta
    condiciones['properties.Dificultad'] = dificultad;
  }
  if (sentido) {
    condiciones['properties.Sentido'] = sentido;
  }
  console.log('Condiciones de filtrado:', condiciones); //Se filtran y recuperan las rutas en la base de datos segun los criterios
    try {
    const rutas = await Ruta.find({
      features: {
        $elemMatch: condiciones
      }
    });

    console.log("Rutas encontradas:", rutas.length);
    res.json(rutas);
  } catch (error) {
    console.error("Error al filtrar rutas:", error);
    res.status(500).send("Error al filtrar rutas");
  }
});

module.exports = router;

const PuntoInteres = require('../models/entradas');

router.get('/puntos-interes', async (req, res) => {
  try {
    const data = await PuntoInteres.findOne(); //Consulta a la base de datos y busca el primer documento en coincidir con los criteros
    res.json(data);
  } catch (error) {
    console.error('❌ Error al obtener puntos de interés:', error);
    res.status(500).json({ error: 'Error al obtener puntos de interés' });
  }
});

module.exports = router;
// Se encarga de finalizar la sesion del usuario
router.get("/logout", (req, res) => {
  req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect("/"); // Redirige a la página de inicio
  });
});

module.exports = router;