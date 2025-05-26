const express = require('express');
const router = express.Router();
const Comentario = require('../models/Comentario');

// Obtener comentarios por ruta
router.get('/:rutaId', async (req, res) => {
  const { rutaId } = req.params;
  try {
    const comentarios = await Comentario.find({ rutaId }).sort({ fecha: -1 });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// Crear nuevo comentario
// Crear nuevo comentario
router.post('/', async (req, res) => {
  // Verificamos si el usuario está autenticado
  if (!req.session.user) {
    return res.status(401).json({ error: 'Debes iniciar sesión para comentar.' });
  }

  const { rutaId, mensaje } = req.body;
  const nombre = req.session.user.username || req.session.user.nombre; // o lo que uses

  try {
    const nuevoComentario = new Comentario({ rutaId, nombre, mensaje });
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
});

module.exports = router;