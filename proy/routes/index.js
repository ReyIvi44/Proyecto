var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');

require('../models/personaje'); 
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
Personaje = mongoose.model('Personaje');


/* GET home page. */
router.get('/', async(req, res, next) =>{
  personajes = await Personaje.find();
  res.render('index', { title: 'Guadaway', personajes, user: req.user});
});


/* */
 router.post('/', async (req, res, next) =>  {
  var geo = { type: "LineString", coordinates: JSON.parse(req.body.ruta) };
  var nuevoPersonaje = new Personaje({ "Nombre": req.body.nombre, "Fuerza": req.body.fuerza, "Faccion": req.body.faccion, "geo":geo });
  await nuevoPersonaje.save();
  res.redirect('/');  
});



// ":ID" parte movil
  router.get('/character/:ID', async (req, res, next) => {
    var characterID = req.params.ID;
    try{
      var personaje = await Personaje.findOne({ '_id': new ObjectId(characterID) })
      res.render('personaje', { title: 'Character page', personaje });
    }
    catch(error){
      res.redirect('/');
    }

  });

  /*if(personaje) res.render('personaje', {title: 'Chara..', personaj})
   */


  router.post('/character/:ID', async (req, res, next) => {
    var characterID = req.params.ID;
    await Personaje.deleteOne({ '_id': new ObjectId(characterID) })
    res.redirect('/');
  });


  router.get('/json', async (req, res, next) => {
    var personajes = await Personaje.find();
    res.json(personajes);
  });

  router.get('/xml', async (req, res, next) => {
    var personajes = await Personaje.find();
      //Pasando a string y luego de nuevo a JSON nos evitamos errores de conversion posteriores con o2x
      personajesFixed = JSON.parse(JSON.stringify(personajes));
      res.set('Content-Type', 'text/xml');
      res.send(o2x({
        '?xml version="1.0" encoding="utf-8"?': null, personajes: { "personaje": personajesFixed }
      }));
  });

  const Ruta = require('../models/ruta');  // Modelo de ruta

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

router.get("/logout", (req, res) => {
  req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect("/"); // Redirige a la página de inicio
  });
});

module.exports = router;

