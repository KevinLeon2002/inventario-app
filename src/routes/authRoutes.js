const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Autenticación pública
router.post('/login', usuarioController.autenticar);

// Rutas que requieren autenticación
router.get('/perfil', 
  authMiddleware.verificarToken,
  usuarioController.obtenerPerfil
);

module.exports = router;