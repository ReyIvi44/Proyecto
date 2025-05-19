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
router.post('/', async (req, res) => {
  const { rutaId, nombre, mensaje } = req.body;
  try {
    const nuevoComentario = new Comentario({ rutaId, nombre, mensaje });
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
});

module.exports = router;