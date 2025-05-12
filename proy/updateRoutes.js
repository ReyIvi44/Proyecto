const mongoose = require('mongoose');
const Ruta = require('./models/ruta'); // Asegúrate de que esta ruta sea correcta

// Conecta con tu base de datos
mongoose.connect('mongodb://localhost:27017/Guadaway', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', async () => {
  console.log('📡 Conectado a MongoDB');

  try {
    const rutas = await Ruta.find();

    for (const ruta of rutas) {
      let actualizado = false;

      for (const feature of ruta.features) {
        const props = feature.properties;

        // Verifica y convierte si es string
        if (typeof props['Duración (h)'] === 'string') {
          const valor = parseFloat(props['Duración (h)']);
          if (!isNaN(valor)) {
            props['Duración (h)'] = valor;
            actualizado = true;
          }
        }

        if (typeof props['Longitud (km)'] === 'string') {
          const valor = parseFloat(props['Longitud (km)']);
          if (!isNaN(valor)) {
            props['Longitud (km)'] = valor;
            actualizado = true;
          }
        }
      }

      // Guarda el documento actualizado
      if (actualizado) {
        console.log(`Guardando ${ruta.name}...`);
        await ruta.save();
        console.log(`✅ Ruta ${ruta.name} actualizada.`);
      } else {
        console.log(`⏭️ Ruta ${ruta.name} no necesita cambios.`);
      }
    }

    console.log('✅ Conversión completada.');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error actualizando rutas:', err);
    mongoose.connection.close();
  }
});