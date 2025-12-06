const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// RF-9: Registrar Usuario (solo administrador)
router.post('/',
  authMiddleware.verificarRol('administrador'),
  usuarioController.registrarUsuario
);

// Obtener todos los usuarios (solo administrador)
router.get('/',
  authMiddleware.verificarRol('administrador'),
  usuarioController.obtenerUsuarios
);

module.exports = router;