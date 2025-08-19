import Usuario from "../models/Usuario.js";
import pool from '../src/db.js'; // Importación única y limpia
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
const usuarioModel = new Usuario();

export const createUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('SET auditoria.usuario_id = $1', [req.user ? req.user.id : null]); // Use req.user.id if available, else null

    const newUsuario = await usuarioModel.create(req.body, client);
    
    await client.query('COMMIT');

    res.status(201).json({
      message: "Usuario creado exitosamente",
      data: newUsuario,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};


export const deleteUsuario = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('SET auditoria.usuario_id = $1', [req.user.id]);

    const userIdFromToken = req.user.id;
    const userIdFromParams = parseInt(req.params.id, 10);

    if (userIdFromToken !== userIdFromParams) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        message: "Prohibido: No tienes permiso para eliminar este usuario.",
      });
    }

    const usuarioEliminado = await usuarioModel.deleteById(userIdFromParams, client);

    if (!usuarioEliminado) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: "Usuario eliminado exitosamente",
      data: usuarioEliminado,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const updateUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('SET auditoria.usuario_id = $1', [req.user.id]);

    const userIdFromToken = req.user.id;
    const userIdFromParams = parseInt(req.params.id, 10);
    if (userIdFromToken !== userIdFromParams) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        message: "Prohibido: No tienes permiso para actualizar este usuario.",
      });
    }

    const body = req.body;
    const usuarioActualizado = await usuarioModel.updateById(
      userIdFromParams,
      body,
      client
    );

    if (!usuarioActualizado) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    await client.query('COMMIT');
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const loginUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  try {
    const { correo, password } = req.body;
    const usuario = await usuarioModel.checkCredential(correo, password);
    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }
    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      iat: Date.now(),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "login exitoso",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('SET auditoria.usuario_id = $1', [req.user.id]);

    const { id } = req.user;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      await client.query('ROLLBACK');
      return res
        .status(400)
        .json({
          message:
            "La nueva contraseña es requerida y debe tener al menos 6 caracteres.",
        });
    }
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await usuarioModel.updatePasswordById(id, newPasswordHash, client);

    await client.query('COMMIT');
    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res
      .status(500)
      .json({
        message: "Error al actualizar la contraseña",
        error: error.message,
      });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const usuario = await usuarioModel.getById(userId);
    if (!usuario){
      return res.status(404).json({
        message: "Usuario no encontrado",
      })
    }
    delete usuario.password_hash;
    res.status(200).json({
      message: "Perfil obtenido exitosamente",
      data: usuario
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Error al obtener el perfil del usuario",
      error: error.message
    })
  }

}