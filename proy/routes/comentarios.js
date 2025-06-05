const express = require('express');
const router = express.Router();
const Comentario = require('../models/Comentario');

// Obtener comentarios de cada ruta
router.get('/:rutaId', async (req, res) => {
  const { rutaId } = req.params;
  try {
    const comentarios = await Comentario.find({ rutaId }).sort({ fecha: -1 }); //Busca en la coleccion de comentarios los que pertenecen a rutaid  y los ordena de la mas reciente a la mas antigua
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});


// Guarda un nuevo comentario en la base de datos
router.post('/', async (req, res) => {
  if (!req.session.user) { //Para incluir comentarios debes iniciar sesion, sino salta un error
    return res.status(401).json({ error: 'Debes iniciar sesión para comentar.' });
  }

  const { rutaId, mensaje } = req.body;
  // Recoge el nombre y el apellido del usuario
  const usuario = req.session.user;
  const nombre = (usuario.name || '') + (usuario.surname ? ' ' + usuario.surname : '');

  console.log("Usuario autenticado en comentario:", usuario);
  console.log("Nombre a guardar:", nombre);

  try { // Crea un documento con la información del comentario
    const nuevoComentario = new Comentario({ rutaId, usuarioId: req.session.user._id, nombre, mensaje });
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (err) {  //Si algo falla devuelve el error
    console.error("Error al guardar comentario:", err);
    res.status(500).json({ error: 'Error al guardar comentario' });
  }
});


module.exports = router;

//Se borra el comentario
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

    if (comentario.usuarioId.toString() !== userId.toString()) { //Si el usuario no coincide con el propietario del comentario devueleve el error
      return res.status(403).json({ error: 'No autorizado para eliminar este comentario' });
    }

    await Comentario.findByIdAndDelete(comentarioId); //Elimina el comentario de la base de datos
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

module.exports = router;