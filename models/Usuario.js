import pool from "../src/db.js";
import bcrypt from "bcryptjs";


class Usuario {
  async create(nuevoUsuario) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nuevoUsuario.password, salt);

      const query = {
        text: `INSERT INTO usuario (nombre, apellido, correo, cedula, password_hash) VALUES 
                ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, correo, cedula`,

        values: [
          nuevoUsuario.nombre,
          nuevoUsuario.apellido,
          nuevoUsuario.correo,
          nuevoUsuario.cedula,
          hashedPassword,
        ],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error al crear usuario: ", error);
      throw error;
    }
  }

  async findAll() {
    try {
      const result = await pool.query("SELECT * FROM usuario");
      return result.rows;
    } catch (error) {
      console.error({ error: "No se han encontrado registros" });
      throw error;
    }
  }

  async getById(id) {
    try {
      const query = {
        text: `SELECT * FROM usuario WHERE id=$1`,
        values: [id],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("No se ha encontrado el elemento: ", error);
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const query = {
        text: `DELETE FROM usuario WHERE id=$1 RETURNING *`,
        values: [id],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("No se ha podido eliminar el registro ", error);
      throw error;
    }
  }

  async updateById(id, updatedBody) {
    try {
      const query = {
        text: `UPDATE usuario SET nombre = $1, apellido = $2, correo = $3, cedula = $4 WHERE id=$5 RETURNING *`,
        values: [
          updatedBody.nombre,
          updatedBody.apellido,
          updatedBody.correo,
          updatedBody.cedula,
          id,
        ],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("No se ha podido actualizar el elemento", error);
      throw error;
    }
  }

  async checkCredential(email, password) {
    try {
      const query = {
        text: `SELECT * FROM usuario WHERE correo = $1`,
        values: [email],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null;
      }
      const usuario = result.rows[0];
      const passwordMatch = await bcrypt.compare(
        password,
        usuario.password_hash
      );
      if (!passwordMatch) {
        return null;
      }
      delete usuario.password_hash;
      return usuario;
    } catch (error) {
      console.error("Error al verificar credenciales: ", error);
      throw error;
    }
  }
}

export default Usuario;
