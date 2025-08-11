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
                    nuevaRuta.creador_id
                ]
            };

            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear ruta:', error);
            throw error;
        };
    };

    async findAll() {
        try{
            const result = await pool.query('SELECT * FROM ruta');
            return result.rows;
        }
        catch (error) {
            console.error('Error al conseguir datos de rutas', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const query = {
                text: 'SELECT * FROM ruta WHERE id = $1',
                values: [id]
            };
            const result = await pool.query(query);
            return result.rows[0];
        }
        catch (error){
            console.error('Error al obtener ruta', error);
            throw error;
        }
    };

async updateById(id, updatedBody, creadorId) {
    try {
        const updatableFields = ['titulo', 'descripcion', 'punto_inicio', 'punto_destino', 'tipo_transporte'];
        const fieldsToUpdate = Object.keys(updatedBody).filter(key => updatableFields.includes(key));

        if (fieldsToUpdate.length === 0) {
            return null; 
        }

        const setClause = fieldsToUpdate
            .map((field, index) => `"${field}" = ${index + 1}`)
            .join(', ');

        const values = fieldsToUpdate.map(field => updatedBody[field]);
        values.push(id);
        const idIndex = values.length;
        values.push(creadorId);
        const creadorIdIndex = values.length;

        const query = {
            text: `UPDATE ruta SET ${setClause} WHERE id = ${idIndex} AND creador_id = ${creadorIdIndex} RETURNING *`,
            values: values
        };
        
        const result = await pool.query(query);
        return result.rows[0];

    } catch (error) {
        console.error("No se ha podido actualizar el elemento en la tabla ruta", error);
        throw error;
    }
}
    async deleteById(rutaId, creadorId){
        try {
            const query = {
                text: 'DELETE FROM ruta WHERE id = $1 AND creador_id = $2 RETURNING *',
                values: [rutaId,
                        creadorId
                ]
            };
            const result = await pool.query(query);
            return result.rows[0];
        }
        catch (error){
            console.error('No se ha podido eliminar el elemento', error);
            throw error
        }
    }
}

export default Ruta;

