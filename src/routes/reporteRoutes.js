const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// RF-6: Generar Reporte de Inventario (administrador y vendedor)
router.get('/inventario',
  authMiddleware.verificarRol('administrador', 'vendedor'),
  reporteController.generarReporteInventario
);

// RF-10: Exportar Reporte (solo administrador)
router.get('/exportar/:tipo',
  authMiddleware.verificarRol('administrador'),
  reporteController.exportarReporte
);

module.exports = router;