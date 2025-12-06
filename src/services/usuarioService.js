const DB = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioService {
  // RF-9: Gestión de Usuarios y Roles
  registrarUsuario(datos, usuarioSolicitante) {
    if (usuarioSolicitante.rol !== 'administrador') {
      throw new Error('Solo el administrador puede registrar usuarios');
    }

    // Validar datos
    if (!datos.email || !datos.password || !datos.nombre || !datos.rol) {
      throw new Error('Todos los campos son requeridos');
    }

    // Validar email único
    if (DB.obtenerUsuarioPorEmail(datos.email)) {
      throw new Error('El email ya está registrado');
    }

    // Validar rol
    const rolesPermitidos = ['administrador', 'vendedor', 'cliente'];
    if (!rolesPermitidos.includes(datos.rol)) {
      throw new Error('Rol inválido');
    }

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(datos.password, salt);

    const usuario = DB.agregarUsuario({
      nombre: datos.nombre,
      email: datos.email,
      password: passwordHash,
      rol: datos.rol,
      activo: true,
      fechaCreacion: new Date()
    });

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      fechaCreacion: usuario.fechaCreacion
    };
  }

  autenticarUsuario(email, password) {
    const usuario = DB.obtenerUsuarioPorEmail(email);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (!usuario.activo) {
      throw new Error('Usuario inactivo');
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET || 'secreto_default',
      { expiresIn: '24h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    };
  }

  obtenerUsuarios(usuarioSolicitante) {
    if (usuarioSolicitante.rol !== 'administrador') {
      throw new Error('Solo el administrador puede ver los usuarios');
    }

    return DB.obtenerUsuarios().map(u => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      activo: u.activo,
      fechaCreacion: u.fechaCreacion
    }));
  }

  obtenerPerfil(usuarioId) {
    const usuario = DB.obtenerUsuarios().find(u => u.id === usuarioId);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      fechaCreacion: usuario.fechaCreacion
    };
  }

  verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_default');
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}

module.exports = new UsuarioService();