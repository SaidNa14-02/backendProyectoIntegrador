import pool from "../src/db.js";
class RutasFavoritas {
    async guardarRuta(rutaId, usuarioId){
        try{
            const query = {
                text:`INSERT INTO rutas_guardadas (ruta_id, usuario_id) VALUES ($1, $2) RETURNING *`,
                values : [rutaId, usuarioId]
            }
            const result = await pool.query(query);
            return result.rows[0]; 
        }
        catch (error){
            console.error("Error al guardar la ruta: ", error);
            throw error;
        }
    }

    async findRutasGuardadasByUsuario(usuarioId){
        try{
            const query = {
                text: `SELECT r.* FROM rutas_guardadas rg
                       JOIN ruta r ON rg.ruta_id = r.id
                       WHERE rg.usuario_id = $1`,
                values: [usuarioId]
            };
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al buscar rutas guardadas por usuario: ", error);
            throw error;
        }
    }

    async eliminarRutaGuardada(rutaId, usuarioId) {
        try {
            const query = {
                text: `DELETE FROM rutas_guardadas WHERE ruta_id = $1 AND usuario_id = $2 RETURNING *`,
                values: [rutaId, usuarioId]
            };
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error("Error al eliminar la ruta guardada: ", error);
            throw error;
        }
    }

    async findRutaGuardada(rutaId, usuarioId) {
        try {
            const query = {
                text: `SELECT * FROM rutas_guardadas WHERE ruta_id = $1 AND usuario_id = $2`,
                values: [rutaId, usuarioId]
            };
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error("Error al buscar ruta guardada específica: ", error);
            throw error;
        }
    }
}

export default RutasFavoritas;