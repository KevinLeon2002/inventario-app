const reporteService = require('../services/reporteService');

const reporteController = {
  // RF-6: Generar Reporte de Inventario
  generarReporteInventario: async (req, res) => {
    try {
      const reporte = await reporteService.generarReporteInventario(req.user);
      res.json({
        success: true,
        data: reporte
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  },

  // RF-10: Exportar Reporte
  exportarReporte: async (req, res) => {
    try {
      const { tipo } = req.params;
      const reporte = await reporteService.exportarReporteCSV(tipo, req.user);
      
      // Configurar headers para descarga
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reporte.nombreArchivo}"`);
      
      res.send(reporte.contenido);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = reporteController;