import pool from "../src/db.js";

class Ruta {
  async create(nuevaRuta) {
    try {
      const query = {
        text: `INSERT INTO ruta (titulo, descripcion, punto_inicio, punto_destino, tipo_transporte, creador_id) 
                       VALUES ($1, $2, $3, $4, $5, $6) 
                       RETURNING *`,
        values: [
          nuevaRuta.titulo,
          nuevaRuta.descripcion,
          nuevaRuta.punto_inicio,
          nuevaRuta.punto_destino,
          nuevaRuta.tipo_transporte,
          nuevaRuta.creador_id,
        ],
      };

      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error al crear ruta:", error);
      throw error;
    }
  }

    async findAll(page = 1, limit = 10) {
        try {
            const pageInt = parseInt(page, 10);
            const limitInt = parseInt(limit, 10);

            const offset = (pageInt - 1) * limitInt;

            const totalQuery = 'SELECT COUNT(*) FROM ruta';
            const totalResult = await pool.query(totalQuery);
            const total = parseInt(totalResult.rows[0].count, 10);

            const dataQuery = 'SELECT * FROM ruta ORDER BY id DESC LIMIT $1 OFFSET $2';
            const result = await pool.query(dataQuery, [limitInt, offset]);

            return {
                data: result.rows,
                pagination: {
                    total,
                    page: pageInt,
                    limit: limitInt,
                    totalPages: Math.ceil(total / limitInt)
                }
            };

        } catch (error) {
            console.error('Error al conseguir datos de rutas con paginación', error);
            throw error;
        }
    }


  async findById(id) {
    try {
      const query = {
        text: "SELECT * FROM ruta WHERE id = $1",
        values: [id],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Error al obtener ruta", error);
      throw error;
    }
  }

  async updateById(id, updatedBody, creadorId) {
    try {
      const updatableFields = [
        "titulo",
        "descripcion",
        "punto_inicio",
        "punto_destino",
        "tipo_transporte",
      ];
      const fieldsToUpdate = Object.keys(updatedBody).filter((key) =>
        updatableFields.includes(key)
      );

      if (fieldsToUpdate.length === 0) {
        // Si no hay nada que actualizar, no tiene sentido consultar la BD.
        return null;
      }

      const setClause = fieldsToUpdate
        .map((field, index) => `"${field}" = $${index + 1}`)
        .join(", ");

      // Prepara los valores para los placeholders
      const values = fieldsToUpdate.map((field) => updatedBody[field]);

      // Añade id y creadorId al final del array de valores para usarlos en el WHERE
      values.push(id);
      const idIndex = values.length;
      values.push(creadorId);
      const creadorIdIndex = values.length;

      const query = {
        // La cláusula WHERE ahora comprueba ambos IDs de forma segura
        text: `UPDATE ruta SET ${setClause} WHERE id = $${idIndex} AND creador_id = $${creadorIdIndex} RETURNING *`,
        values: values,
      };

      const result = await pool.query(query);

      // Si la consulta no devuelve nada, es porque el id no existía o el creador_id no coincidía.
      return result.rows[0];
    } catch (error) {
      console.error(
        "No se ha podido actualizar el elemento en la tabla ruta",
        error
      );
      throw error;
    }
  }
  async deleteById(rutaId, creadorId) {
    try {
      const query = {
        text: "DELETE FROM ruta WHERE id = $1 AND creador_id = $2 RETURNING *",
        values: [rutaId, creadorId],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("No se ha podido eliminar el elemento", error);
      throw error;
    }
  }

  async findByCreatorId(creatorId) {
    try {
      const query = {
        text: "SELECT * FROM ruta WHERE creador_id = $1 ORDER BY id DESC",
        values: [creatorId],
      };
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener las rutas del creador", error);
      throw error;
    }
  }
}

export default Ruta;