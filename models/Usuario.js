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
      const usuario = result.rows[0];
      if (usuario) {
        delete usuario.password_hash;
      }
      return usuario;
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
        const updatableFields = ['nombre', 'apellido', 'correo', 'cedula', 'conductor', 'placa', 'capacidadvehiculo'];
        const fieldsToUpdate = Object.keys(updatedBody).filter(key => updatableFields.includes(key));

        if (fieldsToUpdate.length === 0) {
            return this.getById(id);
        }

        const setClause = fieldsToUpdate
            .map((field, index) => `"${field}" = $${index + 1}`)
            .join(', ');

        const values = fieldsToUpdate.map(field => updatedBody[field]);
        
        values.push(id);
        const idIndex = values.length;

        const query = {
            text: `UPDATE usuario SET ${setClause} WHERE id = $${idIndex} RETURNING *`,
            values: values
        };
        
        const result = await pool.query(query);
        if (result.rows[0]) {
            delete result.rows[0].password_hash;
        }
        return result.rows[0];

    } catch (error) {
        console.error("No se ha podido actualizar el elemento", error);
        throw error;
    }
}

async updatePasswordById(id, newPasswordHash) {
    try {
        const query = {
            text: 'UPDATE usuario SET password_hash = $1 WHERE id = $2 RETURNING id, correo',
            values: [newPasswordHash, id]
        };
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        throw error;
    }
}


  async checkCredential(email, password) {
    try {
      const usuario = await this.findByEmail(email);

      if (!usuario) {
        return null;
      }
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

  async findByEmail(email) {
    try {
      const query = {
        text: `SELECT * FROM usuario WHERE correo = $1`,
        values: [email]
      }
      const result = await pool.query(query);
      return result.rows[0];
    }
    catch (error) {
      console.error("Ha ocurrido un error al buscar el usuario por correo: ", error);
      throw error;
    }
  }
}

export default Usuario;
