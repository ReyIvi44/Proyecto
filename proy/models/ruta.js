const mongoose = require('mongoose');


const featureSchema = new mongoose.Schema({ //Se crea un nuevo esquema para un documento en mongoose
  type: String,
  properties: { //En algunas de las propiedades el nombre incluye comillas ya que contienen espacios o caracteres especiales
    id: String,
    Name: String,
    description: String,
    "Parque Nacional": String,
    Nombre: String,
    Número: String,
    Tipo: String,
    Sentido: String,
    Dificultad: String,
    "Duración (h)": Number,
    "Longitud (km)": Number,
    Recomendaciones: String,
    Descripción: String
  },
  geometry: {
    type: { type: String },
    coordinates: [Array]
  }
});


const rutaSchema = new mongoose.Schema({
  name: String, 
  type: { type: String },
  crs: Object, 
  features: [featureSchema] //Para cada documento rutaSchema, existe una propiedad llamada features con una estructura definida en featureShema
}, { collection: 'rutas' }); //Indica que el modelo que se usará es la colección rutas


const Ruta = mongoose.model('Ruta', rutaSchema);
module.exports = Ruta;