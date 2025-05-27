const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, 'public/images/rutas');
const outputFolder = path.join(__dirname, 'public/images/rutas/resized');
const targetWidth = 450;
const targetHeight = 350;

// Crea la carpeta de salida si no existe
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error leyendo la carpeta:', err);
    return;
  }

  files.forEach((file) => {
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, file);

    // Ignora la propia carpeta 'resized'
    if (file === 'resized' || !/\.(jpg|jpeg|png)$/i.test(file)) return;

    sharp(inputPath)
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center',
      })
      .toFile(outputPath)
      .then(() => {
        console.log(`Redimensionada: ${file}`);
      })
      .catch((err) => {
        console.error(`Error procesando ${file}:`, err);
      });
  });
});
