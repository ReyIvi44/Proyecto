const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comentarioSchema = new Schema({ //Se crea un nuevo esquema para un documento en mongoose
  rutaId: {
    type: Schema.Types.ObjectId,
    ref: 'Ruta',
    required: true
  },
  usuarioId: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
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
//Crea un modelo llamado entradas basado en el esquema comentarioSchema y se exporta