const compraService = require('../services/compraService');

const compraController = {
  // RF-3: Registrar Compra
  registrarCompra: async (req, res) => {
    try {
      const compra = await compraService.registrarCompra(req.body, req.user);
      
      res.status(201).json({
        success: true,
        message: 'Compra registrada exitosamente',
        data: compra
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener todas las compras
  obtenerCompras: async (req, res) => {
    try {
      const compras = await compraService.obtenerCompras(req.user);
      res.json({
        success: true,
        data: compras
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener compra por ID
  obtenerCompra: async (req, res) => {
    try {
      const compra = await compraService.obtenerCompraPorId(req.params.id, req.user);
      res.json({
        success: true,
        data: compra
      });
    } catch (error) {
      res.status(error.message.includes('acceso') ? 403 : 404).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = compraController;