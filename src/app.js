const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const productoRoutes = require('./routes/productoRoutes');
const compraRoutes = require('./routes/compraRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (opcional, útil para debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
    version: '1.0.0'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido al Sistema de Gestión Comercial TecnoRepuestos S.A.',
    version: '1.0.0',
    endpoints: {
      productos: '/api/productos',
      compras: '/api/compras',
      ventas: '/api/ventas',
      clientes: '/api/clientes',
      proveedores: '/api/proveedores',
      auth: '/api/auth',
      reportes: '/api/reportes',
      health: '/api/health'
    },
    documentation: 'Consulte el README.md para más información'
  });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    suggestions: [
      '/api/health',
      '/api/auth/login',
      '/api/productos'
    ]
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.status || 500;
  const response = {
    success: false,
    error: err.message || 'Error interno del servidor'
  };

  // Solo incluir stack trace en desarrollo
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

module.exports = app;