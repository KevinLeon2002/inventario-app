const express = require('express');
const router = express.Router();
const DB = require('../db/database');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware.verificarToken);

// Verificar rol de administrador para todas las rutas
router.use((req, res, next) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Solo el administrador puede gestionar proveedores'
    });
  }
  next();
});

// Crear proveedor
router.post('/', (req, res) => {
  try {
    const { nombre, ruc, direccion, telefono, email } = req.body;
    
    if (!nombre || !ruc) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y RUC son requeridos'
      });
    }

    const proveedor = DB.agregarProveedor({
      nombre,
      ruc,
      direccion: direccion || '',
      telefono: telefono || '',
      email: email || '',
      fechaCreacion: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Proveedor registrado exitosamente',
      data: proveedor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Obtener todos los proveedores
router.get('/', (req, res) => {
  try {
    const proveedores = DB.obtenerProveedores();
    res.json({
      success: true,
      data: proveedores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Obtener proveedor por ID
router.get('/:id', (req, res) => {
  try {
    const proveedores = DB.obtenerProveedores();
    const proveedor = proveedores.find(p => p.id === parseInt(req.params.id));
    
    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      data: proveedor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Actualizar proveedor
router.put('/:id', (req, res) => {
  try {
    const proveedores = DB.obtenerProveedores();
    const proveedor = proveedores.find(p => p.id === parseInt(req.params.id));
    
    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Proveedor actualizado exitosamente',
      data: {
        ...proveedor,
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