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

    async updateById(id, updatedBody){
        try {
            const query = {
                text: `UPDATE ruta 
                       SET titulo = $1, descripcion = $2, punto_inicio = $3, 
                           punto_destino = $4, tipo_transporte = $5 
                       WHERE id = $6 
                       RETURNING *`,
                values: [
                    updatedBody.titulo, 
                    updatedBody.descripcion, 
                    updatedBody.punto_inicio, 
                    updatedBody.punto_destino, 
                    updatedBody.tipo_transporte,
                    id
                ]
            };
            const result = await pool.query(query);
            return result.rows[0];
        }
        catch (error) {
            console.error('No se ha podido actualizar el elemento', error);
            throw error;
        }
    }

    async deleteById(id){
        try {
            const query = {
                text: 'DELETE FROM ruta WHERE id = $1 RETURNING *',
                values: [id]
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

