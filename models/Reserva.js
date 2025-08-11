import pool from "../src/db.js";

class Reserva {
    async create(viajeId, pasajeroId) {
        try {
            const query = {
                text: `INSERT INTO reserva (viaje_id, pasajero_id) VALUES ($1, $2) RETURNING *`,
                values: [viajeId, pasajeroId]
            };
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear la reserva: ", error);
            throw error;
        }
    }


    async findByPasajeroId(pasajeroId) {
        try {
            const query = {
                text: `SELECT * FROM reserva WHERE pasajero_id = $1`,
                values: [pasajeroId]
            };
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al obtener todas las reservas del pasajero: ", error);
            throw error;
        }
    }


    async findByViajeId(viajeId) {
        try {
            const query = {
                text: `SELECT * FROM reserva WHERE viaje_id = $1`,
                values: [viajeId]
            };
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al buscar las reservas del viaje: ", error);
            throw error;
        }
    }

    async delete(viajeId, pasajeroId) {
        try {
            const query = {
                text: `DELETE FROM reserva WHERE viaje_id = $1 AND pasajero_id = $2 RETURNING *`,
                values: [viajeId, pasajeroId]
            };
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error("Error al eliminar la reserva: ", error);
            throw error;
        }
    }
}

export default Reserva;
