const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// RF-1: Registrar Producto (solo administrador)
router.post('/', 
  authMiddleware.verificarRol('administrador'),
  productoController.registrarProducto
);

// RF-2: Actualizar Producto (administrador y vendedor)
router.put('/:id', 
  authMiddleware.verificarRol('administrador', 'vendedor'),
  productoController.actualizarProducto
);

// Obtener producto por ID
router.get('/:id', productoController.obtenerProducto);

// RF-6: Consultar Inventario (administrador y vendedor)
router.get('/',
  authMiddleware.verificarRol('administrador', 'vendedor'),
  productoController.obtenerInventario
);

// RF-7: Alertas por Stock Bajo (solo administrador)
router.get('/alertas/stock-bajo',
  authMiddleware.verificarRol('administrador'),
  productoController.obtenerAlertasStock
);

module.exports = router;