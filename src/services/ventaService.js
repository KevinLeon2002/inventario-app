const DB = require('../db/database');
const Venta = require('../domain/venta');
const productoService = require('./productoService');

class VentaService {
  // RF-4: Registrar Venta y Validar Stock
  registrarVenta(datos, usuario) {
    if (usuario.rol !== 'administrador' && usuario.rol !== 'vendedor') {
      throw new Error('No tiene permisos para registrar ventas');
    }

    const venta = new Venta(datos.clienteId, datos.items);
    
    // Validar venta
    const errores = venta.validar();
    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    // Validar stock para cada producto
    for (const item of venta.items) {
      productoService.validarStockParaVenta(item.productoId, item.cantidad);
    }

    // Procesar la venta
    const ventaRegistrada = DB.agregarVenta({
      ...venta.toJSON(),
      numeroFactura: `FAC-${Date.now()}`,
      usuarioId: usuario.id,
      fechaCreacion: new Date()
    });

    // Actualizar stock y registrar movimientos
    venta.items.forEach(item => {
      productoService.actualizarStock(
        item.productoId,
        item.cantidad,
        'salida',
        `Venta #${ventaRegistrada.id}`,
        usuario.id
      );
    });

    // Generar comprobante PDF (simulado)
    const comprobante = this.generarComprobantePDF(ventaRegistrada);

    return {
      venta: ventaRegistrada,
      comprobante
    };
  }

  // Obtener todas las ventas (NUEVA FUNCIÓN)
  obtenerVentas(usuario) {
    if (usuario.rol === 'cliente') {
      throw new Error('No tiene permisos para ver todas las ventas');
    }

    const ventas = DB.obtenerVentas();
    
    // Si es vendedor, solo puede ver sus propias ventas
    if (usuario.rol === 'vendedor') {
      return ventas
        .filter(v => v.usuarioId === usuario.id)
        .map(venta => ({
          ...venta,
          comprobanteUrl: `/api/ventas/${venta.id}/comprobante`
        }));
    }
    
    // Administrador ve todas
    return ventas.map(venta => ({
      ...venta,
      comprobanteUrl: `/api/ventas/${venta.id}/comprobante`
    }));
  }

  generarComprobantePDF(venta) {
    // En una implementación real, usaríamos una librería como pdfkit
    // Por ahora, simulamos la generación del PDF
    return {
      url: `/api/ventas/${venta.id}/comprobante`,
      nombre: `comprobante-${venta.numeroFactura}.pdf`,
      contenido: `Comprobante de Venta ${venta.numeroFactura}`
    };
  }

  // RF-8: Portal Cliente para Pedidos
  obtenerVentasPorCliente(clienteId, usuario) {
    // Si el usuario es un cliente, solo puede ver sus propias ventas
    if (usuario.rol === 'cliente' && parseInt(clienteId) !== usuario.id) {
      throw new Error('Solo puede ver sus propias ventas');
    }

    const ventas = DB.obtenerVentas().filter(v => v.clienteId === parseInt(clienteId));
    
    return ventas.map(venta => ({
      ...venta,
      comprobanteUrl: `/api/ventas/${venta.id}/comprobante`
    }));
  }

  obtenerVentaPorId(id, usuario) {
    const venta = DB.obtenerVentas().find(v => v.id === parseInt(id));
    
    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    // Control de acceso
    if (usuario.rol === 'cliente' && venta.clienteId !== usuario.id) {
      throw new Error('No tiene acceso a esta venta');
    }

    return venta;
  }
}

module.exports = new VentaService();