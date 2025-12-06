const DB = require("../db/database");
const { generarAlertasStock } = require("../domain/funciones");

class ReporteService {
  // RF-6: Generar Reportes
  generarReporteInventario(usuario) {
    if (usuario.rol !== "administrador" && usuario.rol !== "vendedor") {
      throw new Error("No tiene permisos para generar reportes");
    }

    const productos = DB.obtenerProductos();

    return {
      fechaGeneracion: new Date(),
      totalProductos: productos.length,
      productosActivos: productos.filter((p) => p.activo).length,
      valorTotalInventario: productos.reduce(
        (sum, p) => sum + p.precio * p.stockActual,
        0
      ),
      productosBajoStock: productos.filter(
        (p) => p.stockActual <= p.stockMinimo
      ),
      productosPorCategoria: this.agruparPorCategoria(productos),
      productosMasVendidos: this.obtenerProductosMasVendidos(),
    };
  }

  // RF-10: Exportación de Reportes
  exportarReporteCSV(tipo, usuario) {
    if (usuario.rol !== "administrador") {
      throw new Error("Solo el administrador puede exportar reportes");
    }

    let datos;
    let nombreArchivo;
    let headers;
    let rows;

    switch (tipo) {
      case "inventario":
        const productos = DB.obtenerProductos();
        datos = productos.map((p) => ({
          SKU: p.sku,
          Nombre: p.nombre,
          Categoria: p.categoria,
          Precio: p.precio,
          Stock_Actual: p.stockActual,
          Stock_Minimo: p.stockMinimo,
          Estado: p.activo ? "Activo" : "Inactivo",
          Necesita_Reposicion: p.stockActual <= p.stockMinimo ? "SI" : "NO",
        }));
        nombreArchivo = `inventario_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        headers = [
          "SKU",
          "Nombre",
          "Categoria",
          "Precio",
          "Stock_Actual",
          "Stock_Minimo",
          "Estado",
          "Necesita_Reposicion",
        ];
        break;

      case "ventas":
        const ventas = DB.obtenerVentas();
        datos = ventas.map((v) => ({
          ID: v.id,
          Fecha: v.fecha.toISOString().split("T")[0],
          Cliente_ID: v.clienteId,
          Items: v.items.length,
          Subtotal: v.subtotal,
          IVA: v.iva,
          Total: v.total,
          Estado: v.estado,
        }));
        nombreArchivo = `ventas_${new Date().toISOString().split("T")[0]}.csv`;
        headers = [
          "ID",
          "Fecha",
          "Cliente_ID",
          "Items",
          "Subtotal",
          "IVA",
          "Total",
          "Estado",
        ];
        break;

      default:
        throw new Error("Tipo de reporte no válido");
    }

    // Convertir a CSV
    rows = datos.map((obj) => headers.map((h) => obj[h] || "").join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");

    return {
      nombreArchivo,
      contenido: csvContent,
      tipo: "text/csv",
      fechaExportacion: new Date(),
      usuarioExportador: usuario.nombre,
    };
  }

  agruparPorCategoria(productos) {
    const categorias = {};

    productos.forEach((producto) => {
      const categoria = producto.categoria || "Sin categoría";
      if (!categorias[categoria]) {
        categorias[categoria] = {
          totalProductos: 0,
          valorTotal: 0,
        };
      }
      categorias[categoria].totalProductos++;
      categorias[categoria].valorTotal +=
        producto.precio * producto.stockActual;
    });

    return categorias;
  }

  obtenerProductosMasVendidos() {
    const ventas = DB.obtenerVentas();
    const ventasPorProducto = {};

    ventas.forEach((venta) => {
      venta.items.forEach((item) => {
        if (!ventasPorProducto[item.productoId]) {
          ventasPorProducto[item.productoId] = {
            productoId: item.productoId,
            cantidadVendida: 0,
            totalVentas: 0,
          };
        }
        ventasPorProducto[item.productoId].cantidadVendida += item.cantidad;
        ventasPorProducto[item.productoId].totalVentas +=
          item.precioUnitario * item.cantidad;
      });
    });

    return Object.values(ventasPorProducto)
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 10);
  }
}

module.exports = new ReporteService();
