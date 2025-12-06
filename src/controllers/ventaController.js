const ventaService = require('../services/ventaService');

const ventaController = {
  // RF-4: Registrar Venta
  registrarVenta: async (req, res) => {
    try {
      const resultado = await ventaService.registrarVenta(req.body, req.user);
      
      res.status(201).json({
        success: true,
        message: 'Venta registrada exitosamente',
        data: {
          venta: resultado.venta,
          comprobante: resultado.comprobante
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener todas las ventas (NUEVA FUNCIÓN)
  obtenerVentas: async (req, res) => {
    try {
      const ventas = await ventaService.obtenerVentas(req.user);
      res.json({
        success: true,
        data: ventas
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener venta por ID
  obtenerVenta: async (req, res) => {
    try {
      const venta = await ventaService.obtenerVentaPorId(req.params.id, req.user);
      res.json({
        success: true,
        data: venta
      });
    } catch (error) {
      res.status(error.message.includes('acceso') ? 403 : 404).json({
        success: false,
        message: error.message
      });
    }
  },

  // RF-8: Portal Cliente - Obtener ventas por cliente
  obtenerVentasPorCliente: async (req, res) => {
    try {
      const ventas = await ventaService.obtenerVentasPorCliente(req.params.clienteId, req.user);
      res.json({
        success: true,
        data: ventas
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  },

  // Descargar comprobante
  descargarComprobante: async (req, res) => {
    try {
      const venta = await ventaService.obtenerVentaPorId(req.params.id, req.user);
      
      // Simular la generación de PDF
      const comprobante = ventaService.generarComprobantePDF(venta);
      
      res.json({
        success: true,
        message: 'Comprobante generado exitosamente',
        data: comprobante
      });
    } catch (error) {
      res.status(error.message.includes('acceso') ? 403 : 404).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = ventaController;
