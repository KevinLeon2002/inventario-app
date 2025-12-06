const productoService = require('../services/productoService');

const productoController = {
  // RF-1: Registrar Producto
  registrarProducto: async (req, res) => {
    try {
      const producto = await productoService.registrarProducto(req.body, req.user);
      res.status(201).json({
        success: true,
        message: 'Producto registrado exitosamente',
        data: producto
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // RF-2: Actualizar Producto
  actualizarProducto: async (req, res) => {
    try {
      const producto = await productoService.actualizarProducto(
        parseInt(req.params.id),
        req.body,
        req.user
      );
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // RF-6: Consultar Inventario
  obtenerInventario: async (req, res) => {
    try {
      const productos = await productoService.obtenerInventario(req.user);
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener producto por ID - CORREGIDO
  obtenerProducto: async (req, res) => {
    try {
      const producto = await productoService.obtenerProductoPorId(parseInt(req.params.id), req.user);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // RF-7: Alertas por Stock Bajo
  obtenerAlertasStock: async (req, res) => {
    try {
      const alertas = await productoService.obtenerAlertasStock(req.user);
      res.json({
        success: true,
        data: alertas,
        total: alertas.length
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = productoController;