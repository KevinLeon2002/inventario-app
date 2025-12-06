const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// RF-3: Registrar Compra (solo administrador)
router.post('/',
  authMiddleware.verificarRol('administrador'),
  compraController.registrarCompra
);

// Obtener todas las compras (solo administrador)
router.get('/',
  authMiddleware.verificarRol('administrador'),
  compraController.obtenerCompras
);

// Obtener compra por ID (solo administrador)
router.get('/:id',
  authMiddleware.verificarRol('administrador'),
  compraController.obtenerCompra
);

module.exports = router;