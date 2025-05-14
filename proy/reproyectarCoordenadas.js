const { MongoClient, ObjectId } = require('mongodb');
const proj4 = require('proj4');

// Configura la conexión
const uri = 'mongodb://localhost:27017'; // Cambia si usas otro host o puerto
const dbName = 'Guadaway';
const collectionName = 'entradas';

// Define la proyección EPSG:25830 (UTM zona 30N, ETRS89)
proj4.defs("EPSG:25830", "+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs");

async function reproyectar() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const coleccion = db.collection(collectionName);

    // Obtiene el documento completo con type FeatureCollection
    const documento = await coleccion.findOne({ type: "FeatureCollection" });

    if (!documento) {
      console.log("❌ No se encontró el documento.");
      return;
    }

    const reproyectadas = documento.features.map((f) => {
      const [x, y] = f.geometry.coordinates;
      const [lng, lat] = proj4("EPSG:25830", "WGS84", [x, y]);
      return {
        ...f,
        geometry: {
          ...f.geometry,
          coordinates: [lng, lat]
        }
      };
    });

    // Actualiza el documento
    const resultado = await coleccion.updateOne(
      { _id: documento._id },
      { $set: { features: reproyectadas } }
    );

    console.log(`✅ Coordenadas reproyectadas y documento actualizado. Modificados: ${resultado.modifiedCount}`);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

reproyectar();