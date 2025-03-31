const mongoose = require('mongoose');

const rutaSchema = new mongoose.Schema({
  type: String,
  name: String,
  crs: Object,
  properties: Object,
  features: Array
});

const Ruta = mongoose.model('Ruta', rutaSchema);
module.exports = Ruta;

