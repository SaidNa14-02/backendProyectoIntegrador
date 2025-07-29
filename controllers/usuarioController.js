import Usuario from '../models/Usuario.js';

const usuarioModel = new Usuario();

export const createUsuario = async (req, res) => {
  try {
    const newUsuario = await usuarioModel.create(req.body);
    res.status(201).json({
      message: "Usuario creado exitosamente",
      data: newUsuario
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message
    });
  }
};

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.findAll();
    res.status(200).json({
      message: "Usuarios obtenidos exitosamente",
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
      error: error.message
    });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await usuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }
    res.status(200).json({
      message: "Usuario obtenido exitosamente",
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message
    });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const usuarioEliminado = await usuarioModel.deleteById(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      message: "Usuario eliminado exitosamente",
      data: usuarioEliminado
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message
    });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const usuarioActualizado = await usuarioModel.updateById(id, body);
    if (!usuarioActualizado) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: usuarioActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message
    });
  }
};