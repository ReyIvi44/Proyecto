const mongoose = require('mongoose');

const puntoSchema = new mongoose.Schema({ //Se crea un nuevo esquema para un documento en mongoose
  type: {
    type: String,
    enum: ['FeatureCollection'],
    required: true
  },
  totalFeatures: Number,
  features: [
    {
      type: {
        type: String,
        enum: ['Feature'],
        required: true
      },
      id: String,
      geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number], // Coordenadas en latitud y longitud
          required: true
        }
      },
      geometry_name: String,
      properties: {
        CDID: Number,
        DS_CENTRO: String,
        DS_MUNICIP: String,
        DS_DIRECCI: String,
        CD_POSTAL: String,
        DS_TELEFON: String
      }
    }
  ]
});
const entradas = mongoose.model('entradas', puntoSchema); //Crea un modelo llamado entradas basado en el esquema puntoSchema
module.exports =  entradas;