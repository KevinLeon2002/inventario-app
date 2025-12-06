// Funciones de utilidad para el dominio

/**
 * Calcula el stock disponible después de una operación
 * @param {number} stockActual - Stock actual del producto
 * @param {number} cantidad - Cantidad a agregar o restar
 * @param {string} tipoOperacion - 'entrada' o 'salida'
 * @returns {number} Stock resultante
 */
function calcularStockDisponible(stockActual, cantidad, tipoOperacion) {
  if (tipoOperacion === 'entrada') {
    return stockActual + cantidad;
  } else if (tipoOperacion === 'salida') {
    if (cantidad > stockActual) {
      throw new Error('Stock insuficiente');
    }
    return stockActual - cantidad;
  } else {
    throw new Error('Tipo de operación inválido');
  }
}

/**
 * Calcula el total de una compra o venta
 * @param {Array} items - Array de items con precioUnitario y cantidad
 * @returns {Object} Objeto con subtotal, iva y total
 */
function calcularTotal(items) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.precioUnitario * item.cantidad);
  }, 0);
  
  const iva = subtotal * 0.15; // 15% IVA
  const total = subtotal + iva;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    iva: parseFloat(iva.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}

/**
 * Genera un número de factura único
 * @param {string} prefijo - Prefijo para el número de factura (ej: "FAC-")
 * @returns {string} Número de factura único
 */
function generarNumeroFactura(prefijo = 'FAC-') {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefijo}${timestamp}${random}`;
}

/**
 * Valida que un SKU sea único
 * @param {string} sku - SKU a validar
 * @param {Array} productos - Lista de productos existentes
 * @returns {boolean} true si el SKU es único
 */
function validarSKUUnico(sku, productos) {
  return !productos.some(producto => producto.sku === sku);
}

/**
 * Genera alertas de stock bajo
 * @param {Array} productos - Lista de productos
 * @returns {Array} Productos que necesitan reposición
 */
function generarAlertasStock(productos) {
  return productos.filter(producto => 
    producto.stockActual <= producto.stockMinimo && producto.activo
  );
}

module.exports = {
  calcularStockDisponible,
  calcularTotal,
  generarNumeroFactura,
  validarSKUUnico,
  generarAlertasStock
};