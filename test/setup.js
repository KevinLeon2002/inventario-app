// Configuración global para pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-123';

// Limpiar console.log durante las pruebas si quieres
// const originalLog = console.log;
// console.log = (...args) => {
//   if (!args[0].includes('Base de datos inicializada')) {
//     originalLog(...args);
//   }
// };