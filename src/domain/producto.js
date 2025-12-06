class Producto {
  constructor(sku, nombre, descripcion, precio, stockActual, stockMinimo, categoria) {
    this.sku = sku;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stockActual = stockActual;
    this.stockMinimo = stockMinimo;
    this.categoria = categoria;
    this.activo = true;
    this.fechaCreacion = new Date();
  }

  validar() {
    const errores = [];
    
    if (!this.sku || this.sku.trim() === '') {
      errores.push('El SKU es requerido');
    }
    
    if (!this.nombre || this.nombre.trim() === '') {
      errores.push('El nombre es requerido');
    }
    
    if (typeof this.precio !== 'number' || this.precio <= 0) {
      errores.push('El precio debe ser un número positivo');
    }
    
    if (typeof this.stockActual !== 'number' || this.stockActual < 0) {
      errores.push('El stock actual no puede ser negativo');
    }
    
    if (typeof this.stockMinimo !== 'number' || this.stockMinimo < 0) {
      errores.push('El stock mínimo no puede ser negativo');
    }
    
    return errores;
  }

  tieneStockSuficiente(cantidad) {
    return this.activo && this.stockActual >= cantidad;
  }

  disminuirStock(cantidad) {
    if (cantidad > this.stockActual) {
      throw new Error('Stock insuficiente');
    }
    this.stockActual -= cantidad;
  }

  aumentarStock(cantidad) {
    this.stockActual += cantidad;
  }

  necesitaReposicion() {
    return this.stockActual <= this.stockMinimo;
  }

  toJSON() {
    return {
      sku: this.sku,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      stockActual: this.stockActual,
      stockMinimo: this.stockMinimo,
      categoria: this.categoria,
      activo: this.activo,
      necesitaReposicion: this.necesitaReposicion()
    };
  }
}

module.exports = Producto;