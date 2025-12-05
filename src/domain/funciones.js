//Calcula el stock disponible restando los productos reservados.
function calcularStockDisponible(stockActual, reservados = 0) {
  return stockActual - reservados;
}

//Calcula el total de una compra basada en un arreglo de items.
function calcularTotalCompra(items = []) {
  return items.reduce(
    (s, it) => s + (it.cantidad * Number(it.precio_unit || 0)),
    0
  );
}

module.exports = { calcularStockDisponible, calcularTotalCompra };
