const mongoose = require('mongoose');

// Esquema para las propiedades dentro de "features"
const featureSchema = new mongoose.Schema({
  type: String,
  properties: {
    id: String,
    Name: String,
    description: String,
    "Parque Nacional": String,
    Nombre: String,
    Número: String,
    Tipo: String,
    Sentido: String,
    Dificultad: String,
    "Duración (h)": String,
    "Longitud (km)": String,
    Recomendaciones: String,
    Descripción: String
  },
  geometry: {
    type: { type: String },
    coordinates: [Array] // Asumiendo que las coordenadas son un array de números
  }
});

// Esquema para la colección de "rutas"
const rutaSchema = new mongoose.Schema({
  name: String, 
  type: { type: String },
  crs: Object, 
  features: [featureSchema] // Asegúrate de que el array de features esté correctamente tipado
}, { collection: 'rutas' }); // Nombre de la colección en MongoDB

// Modelo de Mongoose para la ruta
const Ruta = mongoose.model('Ruta', rutaSchema);
module.exports = Ruta;