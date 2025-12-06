const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Sistema: Gestión Comercial TecnoRepuestos S.A.`);
  console.log(`Fecha: ${new Date().toLocaleString()}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});

// Manejo de cierre elegante
process.on('SIGTERM', () => {
  console.log('Señal SIGTERM recibida. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado exitosamente');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});