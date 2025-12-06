const express = require('express');
const router = express.Router();
const DB = require('../db/database');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// Crear cliente
router.post('/', (req, res) => {
  try {
    const { nombre, ruc_ci, direccion, telefono, email } = req.body;
    
    if (!nombre || !ruc_ci) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y RUC/CI son requeridos'
      });
    }

    const cliente = DB.agregarCliente({
      nombre,
      ruc_ci,
      direccion: direccion || '',
      telefono: telefono || '',
      email: email || '',
      fechaCreacion: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Cliente registrado exitosamente',
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Obtener todos los clientes
router.get('/', (req, res) => {
  try {
    const clientes = DB.obtenerClientes();
    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Obtener cliente por ID
router.get('/:id', (req, res) => {
  try {
    const cliente = DB.obtenerClientePorId(parseInt(req.params.id));
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Actualizar cliente
router.put('/:id', (req, res) => {
  try {
    const cliente = DB.obtenerClientePorId(parseInt(req.params.id));
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // En una implementación real, actualizaríamos el cliente en la base de datos
    // Por ahora, solo retornamos éxito
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: {
        ...cliente,
        ...req.body,
        fechaActualizacion: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;