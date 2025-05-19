const { MongoClient } = require('mongodb');

// 🔧 Cambia esto con tu string de conexión real
const uri = 'mongodb://localhost:27017'; 
const dbName = 'Guadaway';
const collectionName = 'rutas';

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const cursor = collection.find();

    let count = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      let updated = false;

      if (Array.isArray(doc.features)) {
        doc.features.forEach((feature, i) => {
          if (feature.properties) {
            const duracion = feature.properties["Duración (h)"];
            const longitud = feature.properties["Longitud (km)"];

            // Intentar convertir si son strings
            if (typeof duracion === 'string') {
              const parsed = parseFloat(duracion);
              if (!isNaN(parsed)) {
                feature.properties["Duración (h)"] = parsed;
                updated = true;
              }
            }

            if (typeof longitud === 'string') {
              const parsed = parseFloat(longitud);
              if (!isNaN(parsed)) {
                feature.properties["Longitud (km)"] = parsed;
                updated = true;
              }
            }
          }
        });

        if (updated) {
          await collection.updateOne({ _id: doc._id }, { $set: { features: doc.features } });
          count++;
        }
      }
    }

    console.log(`Actualizados ${count} documentos.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
