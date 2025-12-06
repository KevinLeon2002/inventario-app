const usuarioService = require('../services/usuarioService');

const usuarioController = {
  // RF-9: Registrar Usuario (solo administrador)
  registrarUsuario: async (req, res) => {
    try {
      const usuario = await usuarioService.registrarUsuario(req.body, req.user);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: usuario
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Autenticar usuario
  autenticar: async (req, res) => {
    try {
      const { email, password } = req.body;
      const resultado = await usuarioService.autenticarUsuario(email, password);
      
      res.json({
        success: true,
        message: 'Autenticación exitosa',
        data: resultado
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener perfil
  obtenerPerfil: async (req, res) => {
    try {
      const perfil = await usuarioService.obtenerPerfil(req.user.id);
      res.json({
        success: true,
        data: perfil
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener todos los usuarios (solo administrador)
  obtenerUsuarios: async (req, res) => {
    try {
      const usuarios = await usuarioService.obtenerUsuarios(req.user);
      res.json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = usuarioController;