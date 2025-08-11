import pool from "../src/db.js";
class ViajeCompartido {
  async createViajeCompartido(viaje) {
    try {
      const query = {
        text: "INSERT INTO viajecompartido (origen, destino, fecha_hora_salida, asientos_ofrecidos, id_conductor) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [
          viaje.origen,
          viaje.destino,
          viaje.fecha_hora_salida,
          viaje.asientos_ofrecidos,
          viaje.id_conductor,
        ],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error al crear el viaje compartido: ", error);
      throw error;
    }
  }

  async getViajesCompartidos() {
    try {
      const query = {text:`
        SELECT 
            v.*, 
            u.nombre AS conductor_nombre, 
            u.apellido AS conductor_apellido
          FROM viajecompartido v
          LEFT JOIN usuario u ON v.id_conductor = u.id
          ORDER BY v.fecha_hora_salida DESC
        `};
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener los viajes compartidos: ", error);
      throw error;
    }
  }
  async getById(id) {
    try {
      const query = {
        text: `SELECT v. *, u.nombre AS conductor_nombre, u.apellido AS conductor_apellido
               FROM viajecompartido v
               LEFT JOIN usuario u ON v.id_conductor = u.id
               WHERE v.id = $1`,
        values: [id],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error al obtener los viajes compartidos: ", error);
      throw error;
    }
  }

  async getViajeCompartidoByUserId(userId) {
    try {
      const query = {
        text: `
          SELECT 
            v.*, 
            u.nombre AS conductor_nombre, 
            u.apellido AS conductor_apellido
          FROM viajecompartido v
          LEFT JOIN usuario u ON v.id_conductor = u.id
          WHERE v.id_conductor = $1 
          ORDER BY v.fecha_hora_salida DESC
        `,
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error(
        "Error al obtener los viajes creados por el usuario: ",
        error
      );
      throw error;
    }
  }

  async deleteViajeCompartidoById(id) {
    try {
      const query = {
        text: `DELETE FROM viajecompartido WHERE id = $1 RETURNING *`,
        values: [id],
      };
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return null; // No se encontró el viaje compartido
      }
      return result.rows[0];
    } catch (error) {
      console.error("Error al eliminar el viaje compartido: ", error);
      throw error;
    }
  }

  async updateViajeById(id, updatedBody, conductorId) {
    try {
      const updatableFields = [
        "origen",
        "destino",
        "fecha_hora_salida",
        "asientos_ofrecidos",
        "estado"
      ];
      const fieldsToUpdate = Object.keys(updatedBody).filter((key) =>
        updatableFields.includes(key)
      );

      if (fieldsToUpdate.length === 0) {
        return null;
      }

      const setClause = fieldsToUpdate
        .map((field, index) => `"${field}" = ${index + 1}`)
        .join(", ");

      const values = fieldsToUpdate.map((field) => updatedBody[field]);

      values.push(id);
      const idIndex = values.length;
      values.push(conductorId);
      const conductorIdIndex = values.length;

      const query = {
        text: `UPDATE viajecompartido SET ${setClause} WHERE id = ${idIndex} AND id_conductor = ${conductorIdIndex} RETURNING *`,
        values: values,
      };

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("No se ha podido actualizar el elemento", error);
      throw error;
    }
  }

  async updateStatus(viajeId, nuevoEstado) {
    try {
        const query = {
            text: `UPDATE viajecompartido SET estado = $1 WHERE id = $2 RETURNING *`,
            values: [nuevoEstado, viajeId]
        };
        const result = await pool.query(query);
        
        // Devuelve el viaje actualizado. Si no se encontró, el controlador recibirá undefined.
        return result.rows[0]; 
    } catch (error) {
        console.error("Error al actualizar el estado del viaje compartido: ", error);
        throw error;
    }
  }
}

export default ViajeCompartido;