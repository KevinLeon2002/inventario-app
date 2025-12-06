const DB = require('../db/database');
const Producto = require('../domain/producto');
const { validarSKUUnico } = require('../domain/funciones');

class ProductoService {
  // RF-1: Registrar Producto
  registrarProducto(datos, usuario) {
    if (usuario.rol !== 'administrador') {
      throw new Error('Solo el administrador puede registrar productos');
    }

    // Validar SKU único
    if (!validarSKUUnico(datos.sku, DB.obtenerProductos())) {
      throw new Error('El SKU ya existe');
    }

    // Validar stock no negativo
    if (datos.stockActual < 0 || datos.stockMinimo < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const producto = new Producto(
      datos.sku,
      datos.nombre,
      datos.descripcion || '',
      parseFloat(datos.precio),
      parseInt(datos.stockActual),
      parseInt(datos.stockMinimo),
      datos.categoria || 'General'
    );

    const errores = producto.validar();
    if (errores.length > 0) {
      throw new Error(errores.join(', '));
    }

    const productoGuardado = DB.agregarProducto({
      ...producto.toJSON(),
      fechaCreacion: new Date()
    });

    // Registrar movimiento inicial
    DB.agregarMovimiento({
      productoId: productoGuardado.id,
      tipo: 'entrada',
      cantidad: productoGuardado.stockActual,
      motivo: 'Registro inicial',
      usuarioId: usuario.id
    });

    return productoGuardado;
  }

  // RF-2: Actualizar Producto
  actualizarProducto(id, datos, usuario) {
    if (usuario.rol !== 'administrador' && usuario.rol !== 'vendedor') {
      throw new Error('No tiene permisos para actualizar productos');
    }

    const producto = DB.obtenerProductoPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // No permitir editar SKU
    if (datos.sku && datos.sku !== producto.sku) {
      throw new Error('No se puede editar el SKU');
    }

    // Validaciones
    if (datos.stock !== undefined && datos.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const productoActualizado = DB.actualizarProducto(id, {
      ...datos,
      fechaActualizacion: new Date()
    });

    return productoActualizado;
  }

  // RF-6: Consultar Inventario
  obtenerInventario(usuario) {
    if (usuario.rol !== 'administrador' && usuario.rol !== 'vendedor') {
      throw new Error('No tiene permisos para consultar el inventario');
    }

    return DB.obtenerProductos();
  }

  // RF-7: Alertas por Stock Bajo
  obtenerAlertasStock(usuario) {
    if (usuario.rol !== 'administrador') {
      throw new Error('Solo el administrador puede ver las alertas de stock');
    }

    const productos = DB.obtenerProductos();
    return productos.filter(p => p.stockActual <= p.stockMinimo && p.activo);
  }

  // Validar stock para venta - CORREGIDO
  validarStockParaVenta(productoId, cantidad) {
    const producto = DB.obtenerProductoPorId(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    if (!producto.activo) {
      throw new Error('Producto inactivo');
    }

    //CORRECCIÓN: Usar comparación directa en lugar del método
    if (producto.stockActual < cantidad) {
      throw new Error(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stockActual}`);
    }

    return true;
  }

  // Actualizar stock
  actualizarStock(productoId, cantidad, tipo, motivo, usuarioId) {
    const producto = DB.obtenerProductoPorId(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (tipo === 'salida' && cantidad > producto.stockActual) {
      throw new Error('Stock insuficiente');
    }

    // Actualizar stock
    if (tipo === 'entrada') {
      producto.stockActual += cantidad;
    } else {
      producto.stockActual -= cantidad;
    }

    // Registrar movimiento
    DB.agregarMovimiento({
      productoId,
      tipo,
      cantidad,
      motivo,
      usuarioId,
      fecha: new Date()
    });

    return producto;
  }

  // Obtener producto por ID (para el controlador)
  obtenerProductoPorId(id, usuario) {
    const producto = DB.obtenerProductoPorId(id);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    return producto;
  }
}

module.exports = new ProductoService();