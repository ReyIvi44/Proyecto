const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
  rutaId: {
    type: Schema.Types.ObjectId,
    ref: 'Ruta',
    required: true
  },
  nombre: String,
  mensaje: String,
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comentario', comentarioSchema);