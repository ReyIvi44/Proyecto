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
  if (!req.session.user) {
    return res.status(401).json({ error: 'Debes iniciar sesión para comentar.' });
  }

  const { rutaId, mensaje } = req.body;

  const usuario = req.session.user;
  const nombre = (usuario.name || '') + (usuario.surname ? ' ' + usuario.surname : '');

  console.log("Usuario autenticado en comentario:", usuario);
  console.log("Nombre a guardar:", nombre);

  try {
    const nuevoComentario = new Comentario({ rutaId, usuarioId: req.session.user._id, nombre, mensaje });
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (err) {
    console.error("Error al guardar comentario:", err);
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
});


module.exports = router;


router.delete('/:comentarioId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Debes iniciar sesión para eliminar un comentario.' });
  }

  const { comentarioId } = req.params;
  const userId = req.session.user._id;

  try {
    const comentario = await Comentario.findById(comentarioId);

    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    if (comentario.usuarioId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'No autorizado para eliminar este comentario' });
    }

    await Comentario.findByIdAndDelete(comentarioId);
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

module.exports = router;