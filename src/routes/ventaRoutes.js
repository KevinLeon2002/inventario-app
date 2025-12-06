const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// RF-4: Registrar Venta (administrador y vendedor)
router.post('/',
  authMiddleware.verificarRol('administrador', 'vendedor'),
  ventaController.registrarVenta
);

// Obtener todas las ventas (administrador y vendedor) - NUEVA RUTA
router.get('/',
  authMiddleware.verificarRol('administrador', 'vendedor'),
  ventaController.obtenerVentas
);

// RF-8: Obtener ventas por cliente
router.get('/cliente/:clienteId', ventaController.obtenerVentasPorCliente);

// Obtener venta por ID
router.get('/:id', ventaController.obtenerVenta);

// Descargar comprobante
router.get('/:id/comprobante', ventaController.descargarComprobante);

module.exports = router;