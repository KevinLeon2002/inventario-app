const {
  calcularStockDisponible,
  calcularTotal,
  generarNumeroFactura,
  validarSKUUnico,
  generarAlertasStock
} = require('../../src/domain/funciones');

describe('Funciones del Dominio', () => {
  describe('calcularStockDisponible', () => {
    test('debe calcular correctamente stock para entrada', () => {
      expect(calcularStockDisponible(100, 50, 'entrada')).toBe(150);
    });

    test('debe calcular correctamente stock para salida', () => {
      expect(calcularStockDisponible(100, 30, 'salida')).toBe(70);
    });

    test('debe lanzar error si salida excede stock disponible', () => {
      expect(() => calcularStockDisponible(100, 150, 'salida'))
        .toThrow('Stock insuficiente');
    });

    test('debe lanzar error para tipo de operación inválido', () => {
      expect(() => calcularStockDisponible(100, 50, 'invalido'))
        .toThrow('Tipo de operación inválido');
    });
  });

  describe('calcularTotal', () => {
    test('debe calcular correctamente total con IVA', () => {
      const items = [
        { precioUnitario: 10, cantidad: 2 },
        { precioUnitario: 20, cantidad: 1 }
      ];

      const resultado = calcularTotal(items);
      
      expect(resultado.subtotal).toBe(40); // (10*2 + 20*1)
      expect(resultado.iva).toBe(6); // 40 * 0.15
      expect(resultado.total).toBe(46); // 40 + 6
    });

    test('debe manejar array vacío', () => {
      const resultado = calcularTotal([]);
      
      expect(resultado.subtotal).toBe(0);
      expect(resultado.iva).toBe(0);
      expect(resultado.total).toBe(0);
    });
  });

  describe('generarNumeroFactura', () => {
    test('debe generar número de factura con prefijo', () => {
      const numero = generarNumeroFactura('FAC-');
      expect(numero).toMatch(/^FAC-\d{9}$/);
    });

    test('debe generar número de factura único', () => {
      const numero1 = generarNumeroFactura();
      const numero2 = generarNumeroFactura();
      
      expect(numero1).not.toBe(numero2);
    });
  });

  describe('validarSKUUnico', () => {
    test('debe retornar true para SKU único', () => {
      const productos = [
        { sku: 'SKU001' },
        { sku: 'SKU002' }
      ];
      
      expect(validarSKUUnico('SKU003', productos)).toBe(true);
    });

    test('debe retornar false para SKU duplicado', () => {
      const productos = [
        { sku: 'SKU001' },
        { sku: 'SKU002' }
      ];
      
      expect(validarSKUUnico('SKU002', productos)).toBe(false);
    });
  });

  describe('generarAlertasStock', () => {
    test('debe detectar productos con stock bajo', () => {
      const productos = [
        { sku: 'SKU001', stockActual: 5, stockMinimo: 10, activo: true },
        { sku: 'SKU002', stockActual: 15, stockMinimo: 10, activo: true },
        { sku: 'SKU003', stockActual: 2, stockMinimo: 5, activo: true },
        { sku: 'SKU004', stockActual: 0, stockMinimo: 3, activo: false } // inactivo
      ];

      const alertas = generarAlertasStock(productos);
      
      expect(alertas).toHaveLength(2);
      expect(alertas[0].sku).toBe('SKU001');
      expect(alertas[1].sku).toBe('SKU003');
    });
  });
});