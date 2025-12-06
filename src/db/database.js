const bcrypt = require("bcryptjs");

// Base de datos en memoria
const database = {
  productos: [],
  compras: [],
  ventas: [],
  clientes: [],
  proveedores: [],
  usuarios: [],
  movimientos: [],
};

// Funciones de ayuda para la base de datos
const DB = {
  // Productos
  agregarProducto: (producto) => {
    producto.id = database.productos.length + 1;
    producto.fechaCreacion = new Date();
    database.productos.push(producto);
    return producto;
  },

  obtenerProductos: () => database.productos,

  obtenerProductoPorId: (id) => database.productos.find((p) => p.id === id),

  obtenerProductoPorSKU: (sku) => database.productos.find((p) => p.sku === sku),

  actualizarProducto: (id, datos) => {
    const index = database.productos.findIndex((p) => p.id === id);
    if (index !== -1) {
      database.productos[index] = { ...database.productos[index], ...datos };
      return database.productos[index];
    }
    return null;
  },

  // En database.js - funciones agregarCompra y agregarVenta
  agregarCompra: (compra) => {
    compra.id = database.compras.length + 1;
    compra.fechaCreacion = new Date();

    // MEJORAR EL PARSING DE ITEMS
    if (compra.items) {
      if (typeof compra.items === "string") {
        try {
          // Si es un string JSON, parsearlo
          if (compra.items.startsWith("[")) {
            compra.items = JSON.parse(compra.items);
          }
          // Si es el formato PowerShell @{...}
          else if (compra.items.includes("productoId")) {
            // Extraer items del formato PowerShell
            const itemRegex = /@{([^}]+)}/g;
            let match;
            const items = [];

            while ((match = itemRegex.exec(compra.items)) !== null) {
              const itemStr = match[1];
              const item = {};
              const props = itemStr.split(";");

              props.forEach((prop) => {
                const [key, value] = prop.split("=");
                if (key && value) {
                  const cleanKey = key.trim();
                  const cleanValue = value.trim();
                  item[cleanKey] = isNaN(cleanValue)
                    ? cleanValue
                    : parseFloat(cleanValue);
                }
              });

              items.push(item);
            }

            compra.items = items;
          }
        } catch (error) {
          console.error("Error parseando items:", error);
          compra.items = [];
        }
      }
    } else {
      compra.items = [];
    }

    // Calcular total
    if (compra.items && compra.items.length > 0) {
      compra.total = compra.items.reduce((sum, item) => {
        return sum + item.precioUnitario * item.cantidad;
      }, 0);
    }

    database.compras.push(compra);
    return compra;
  },

  obtenerCompras: () => database.compras,

  // Ventas
  agregarVenta: (venta) => {
    venta.id = database.ventas.length + 1;
    venta.fechaCreacion = new Date();

    // Asegurar que items sea un array válido (misma lógica que compras)
    if (venta.items && typeof venta.items === "string") {
      try {
        if (venta.items.startsWith("[") || venta.items.includes("productoId")) {
          const cleanStr = venta.items.replace(/^@{/, "{").replace(/}$/, "");
          if (cleanStr.includes(";")) {
            const items = [];
            const itemMatches = venta.items.match(/@{[^}]+}/g);
            if (itemMatches) {
              itemMatches.forEach((match) => {
                const props = match.replace(/^@{|}$/g, "").split(";");
                const item = {};
                props.forEach((prop) => {
                  const [key, value] = prop.split("=");
                  if (key && value) {
                    item[key.trim()] = isNaN(value)
                      ? value.trim()
                      : parseFloat(value);
                  }
                });
                items.push(item);
              });
              venta.items = items;
            }
          } else {
            venta.items = JSON.parse(venta.items);
          }
        }
      } catch (e) {
        console.error("Error parseando items de venta:", e.message);
        venta.items = [];
      }
    }

    // Calcular totales si no existen
    if (!venta.subtotal && venta.items && venta.items.length > 0) {
      venta.subtotal = venta.items.reduce((sum, item) => {
        return sum + item.precioUnitario * item.cantidad;
      }, 0);
      venta.iva = venta.subtotal * 0.15;
      venta.total = venta.subtotal + venta.iva;
    }

    database.ventas.push(venta);
    return venta;
  },

  obtenerVentas: () => database.ventas,

  // Clientes
  agregarCliente: (cliente) => {
    cliente.id = database.clientes.length + 1;
    cliente.fechaCreacion = new Date();
    database.clientes.push(cliente);
    return cliente;
  },

  obtenerClientes: () => database.clientes,

  obtenerClientePorId: (id) => database.clientes.find((c) => c.id === id),

  // Proveedores
  agregarProveedor: (proveedor) => {
    proveedor.id = database.proveedores.length + 1;
    proveedor.fechaCreacion = new Date();
    database.proveedores.push(proveedor);
    return proveedor;
  },

  obtenerProveedores: () => database.proveedores,

  // Usuarios
  agregarUsuario: (usuario) => {
    usuario.id = database.usuarios.length + 1;
    usuario.fechaCreacion = new Date();
    database.usuarios.push(usuario);
    return usuario;
  },

  obtenerUsuarioPorEmail: (email) =>
    database.usuarios.find((u) => u.email === email),

  obtenerUsuarios: () => database.usuarios,

  // Movimientos de inventario
  agregarMovimiento: (movimiento) => {
    movimiento.id = database.movimientos.length + 1;
    movimiento.fecha = new Date();
    database.movimientos.push(movimiento);
    return movimiento;
  },

  obtenerMovimientosPorProducto: (productoId) =>
    database.movimientos.filter((m) => m.productoId === productoId),

  // Inicializar con datos de prueba
  inicializarDatos: () => {
    // Usuario administrador por defecto con contraseña CORRECTA
    database.usuarios.push({
      id: 1,
      nombre: "Administrador Principal",
      email: "admin@tecnorepuestos.com",
      password: bcrypt.hashSync("Admin123!", 10), // HASH CORRECTO
      rol: "administrador",
      fechaCreacion: new Date(),
      activo: true,
    });

    // Cliente de prueba
    database.clientes.push({
      id: 1,
      nombre: "Juan Pérez",
      ruc_ci: "0912345678",
      direccion: "Calle Los Ríos 456",
      telefono: "0987654321",
      email: "juan.perez@email.com",
      fechaCreacion: new Date(),
    });

    // Proveedor de prueba
    database.proveedores.push({
      id: 1,
      nombre: "Electrónica Global S.A.",
      ruc: "0991234567001",
      direccion: "Av. Principal 123",
      telefono: "042345678",
      email: "ventas@electronicaglobal.com",
      fechaCreacion: new Date(),
    });

    console.log("Base de datos inicializada con datos de prueba");
  },
};

// Inicializar datos al cargar
DB.inicializarDatos();

module.exports = DB;
