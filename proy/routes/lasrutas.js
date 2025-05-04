const express = require('express');
const router = express.Router();
const Ruta = require('../models/ruta'); // Importamos el modelo

/*// 🔹 Obtener todas las rutas en formato JSON (para la página de inicio con el mapa)
router.get('/geojson', async (req, res) => {
  try {
    const rutas = await Ruta.find();
    res.json(rutas); // Devuelve todas las rutas en formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las rutas');
  }
});
*/
// Ruta para obtener todas las rutas en formato GeoJSON
router.get('/geojson', async (req, res) => {
  try {
    const rutas = await Ruta.find();

    const geojson = {
      type: "FeatureCollection",
      features: rutas.map(ruta => ({
        type: "Feature",
        _id: ruta._id,  // ID de la ruta
        properties: {
          name: ruta.name,
          crs: ruta.crs || {},
          detalles: ruta.features.map(feature => ({
            id: feature.properties.id,
            Name: feature.properties.Name,
            description: feature.properties.description,
            Parque_Nacional: feature.properties["Parque Nacional"],
            Nombre: feature.properties.Nombre,
            Número: feature.properties.Número,
            Tipo: feature.properties.Tipo,
            Sentido: feature.properties.Sentido,
            Dificultad: feature.properties.Dificultad,
            Duración_h: feature.properties["Duración (h)"],
            Longitud_km: feature.properties["Longitud (km)"],
            Recomendaciones: feature.properties.Recomendaciones,
            Descripción: feature.properties.Descripción
          })),
        },
        geometry: ruta.features.length > 0 ? ruta.features[0].geometry : null
      }))
    };

    console.log(geojson); // Debugging para verificar la estructura
    res.json(geojson);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las rutas');
  }
});

module.exports = router; // Exportamos el router para que app.js lo use

/*Rutas para el Ver mas información*/ 
// Ruta para mostrar la página específica de la ruta

//BIEN
router.get('/rutaespecifica/:name', async (req, res) => {
  try {
    const rutaName = decodeURIComponent(req.params.name);
    const ruta = await Ruta.findOne({
      "features.properties.Nombre": new RegExp(`^${rutaName}$`, 'i') // insensible a mayúsculas
    });

    if (!ruta) {
      return res.status(404).send('Ruta no encontrada');
    }

    res.render('rutaespecifica', { ruta });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la ruta');
  }
});

//BIEN
router.get('/rutaespecifica', async (req, res) => {
  try {
    const rutaName = req.query.Buscar;  // Obtenemos el nombre de la ruta desde la query

    if (!rutaName) {
      return res.status(400).send('Por favor ingrese un nombre de ruta');
    }

    const ruta = await Ruta.findOne({ "features.properties.Nombre": new RegExp(rutaName, 'i') }); // Usamos una expresión regular para hacer la búsqueda insensible a mayúsculas

    if (!ruta) {
      return res.status(404).send('Ruta no encontrada');
    }

    // Renderizar la página de la ruta específica
    res.render('rutaespecifica', { ruta: ruta });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la ruta');
  }
});
module.exports = router;


/*Rutas para la busqueda de rutas en la pantalla*/ 
router.get('/autocomplete', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const query = req.query.query;

    const rutas = await Ruta.find({
      "features.properties.Nombre": { $regex: query, $options: 'i' }
    }).limit(5); // Limitar a 5 sugerencias

    let resultado = [];

    rutas.forEach(ruta => {
      if (Array.isArray(ruta.features)) {
        ruta.features.forEach(feature => {
          if (
            feature.properties &&
            feature.properties.Nombre &&
            feature.properties.Nombre.toLowerCase().includes(query.toLowerCase())
          ) {
            resultado.push({
              Nombre: feature.properties.Nombre,
              Dificultad: feature.properties.Dificultad,
              "Duración (h)": feature.properties["Duración (h)"]
            });
          }
        });
      }
    });

    res.json(resultado.slice(0, 5)); // También asegúrate de devolver solo 5 resultados
  } catch (error) {
    console.error("Error en /autocomplete:", error);
    res.status(500).send('Error al obtener las rutas');
  }
});