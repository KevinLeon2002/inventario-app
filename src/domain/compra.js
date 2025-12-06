class Compra {
  constructor(proveedorId, items) {
    this.proveedorId = proveedorId;
    this.items = items;
    this.fecha = new Date();
    this.total = this.calcularTotal();
  }

  calcularTotal() {
    return this.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
  }

  validar() {
    const errores = [];
    
    if (!this.proveedorId) {
      errores.push('El proveedor es requerido');
    }
    
    if (!this.items || this.items.length === 0) {
      errores.push('La compra debe contener al menos un producto');
    }
    
    this.items.forEach((item, index) => {
      if (!item.productoId) {
        errores.push(`Item ${index + 1}: El producto es requerido`);
      }
      if (!item.cantidad || item.cantidad <= 0) {
        errores.push(`Item ${index + 1}: La cantidad debe ser positiva`);
      }
      if (!item.precioUnitario || item.precioUnitario <= 0) {
        errores.push(`Item ${index + 1}: El precio unitario debe ser positivo`);
      }
    });
    
    return errores;
  }

  toJSON() {
    return {
      proveedorId: this.proveedorId,
      items: this.items,
      fecha: this.fecha,
      total: this.total
    };
  }
}

module.exports = Compra;