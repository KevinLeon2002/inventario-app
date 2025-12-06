class Venta {
  constructor(clienteId, items) {
    this.clienteId = clienteId;
    this.items = items;
    this.fecha = new Date();
    this.estado = 'pendiente';
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
    this.calcularTotales();
  }

  calcularTotales() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    this.iva = this.subtotal * 0.15; // 15% IVA
    this.total = this.subtotal + this.iva;
  }

  validar() {
    const errores = [];
    
    if (!this.clienteId) {
      errores.push('El cliente es requerido');
    }
    
    if (!this.items || this.items.length === 0) {
      errores.push('La venta debe contener al menos un producto');
    }
    
    return errores;
  }

  toJSON() {
    return {
      clienteId: this.clienteId,
      items: this.items,
      fecha: this.fecha,
      estado: this.estado,
      subtotal: this.subtotal,
      iva: this.iva,
      total: this.total
    };
  }
}

module.exports = Venta;