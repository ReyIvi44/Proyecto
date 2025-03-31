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


// Ruta para mostrar la página específica de la ruta
router.get('/rutaespecifica/:name', async (req, res) => {
  try {
    // Buscar la ruta usando el nombre de la ruta
    const rutaName = req.params.name;
    const ruta = await Ruta.findOne({ "features.properties.Name": rutaName });

    if (!ruta) {
      return res.status(404).send('Ruta no encontrada');
    }

    // Renderizar la página de la ruta específica con los datos
    res.render('rutaespecifica', { ruta: ruta });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la ruta');
  }
});
module.exports = router;