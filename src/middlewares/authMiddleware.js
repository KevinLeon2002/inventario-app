const usuarioService = require('../services/usuarioService');

const authMiddleware = {
  // Verificar token JWT
  verificarToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const usuario = usuarioService.verificarToken(token);
      req.user = usuario;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  },

  // Verificar rol específico
  verificarRol: (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      if (!roles.includes(req.user.rol)) {
        return res.status(403).json({
          success: false,
          message: 'No tiene permisos para realizar esta acción'
        });
      }

      next();
    };
  }
};

module.exports = authMiddleware;