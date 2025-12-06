const DB = require('../db/database');
const Compra = require('../domain/compra');
const productoService = require('./productoService');

class CompraService {
  // RF-3: Registrar Compra a Proveedor
  registrarCompra(datos, usuario) {
    if (usuario.rol !== 'administrador') {
      throw new Error('Solo el administrador puede registrar compras');
    }

    const compra = new Compra(datos.proveedorId, datos.items);
    
    // Validar compra
    const errores = compra.validar();
    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    // Registrar compra
    const compraRegistrada = DB.agregarCompra({
      ...compra.toJSON(),
      numeroCompra: `COM-${Date.now()}`,
      usuarioId: usuario.id,
      fechaCreacion: new Date()
    });

    // Actualizar stock y registrar movimientos
    compra.items.forEach(item => {
      productoService.actualizarStock(
        item.productoId,
        item.cantidad,
        'entrada',
        `Compra #${compraRegistrada.id}`,
        usuario.id
      );
    });

    // Enviar notificación (simulada)
    this.enviarNotificacionCompra(compraRegistrada);

    return compraRegistrada;
  }

  enviarNotificacionCompra(compra) {
    // Simulación de envío de notificación
    console.log(`Notificación: Compra #${compra.numeroCompra} registrada`);
    console.log(`Total: $${compra.total.toFixed(2)}`);
    console.log(`Items: ${compra.items.length}`);
    
    return {
      enviada: true,
      fecha: new Date()
    };
  }

  obtenerCompras(usuario) {
    if (usuario.rol !== 'administrador') {
      throw new Error('Solo el administrador puede ver las compras');
    }

    return DB.obtenerCompras();
  }

  obtenerCompraPorId(id, usuario) {
    if (usuario.rol !== 'administrador') {
      throw new Error('Solo el administrador puede ver las compras');
    }

    const compra = DB.obtenerCompras().find(c => c.id === parseInt(id));
    
    if (!compra) {
      throw new Error('Compra no encontrada');
    }

    return compra;
  }
}

module.exports = new CompraService();