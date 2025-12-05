const { calcularStockDisponible,calcularTotalCompra } = require('../../src/domain/funciones');

describe('Pruebas unitarias de utilidades de inventario', () => {

  test('calcula stock disponible correctamente', () => {
    expect(calcularStockDisponible(10, 3)).toBe(7);
    expect(calcularStockDisponible(5, 0)).toBe(5);
    expect(calcularStockDisponible(20, 10)).toBe(10);
  });

  test('calcula total de compra correctamente', () => {
    const items = [
      { cantidad: 2, precio_unit: 10 },
      { cantidad: 1, precio_unit: 5.5 }
    ];
    expect(calcularTotalCompra(items)).toBeCloseTo(25.5);
  });

});

