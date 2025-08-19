import Reserva from '../models/Reserva.js';
import ViajeCompartido from '../models/ViajeCompartido.js';

const reservaModel = new Reserva();
const viajeModel = new ViajeCompartido();

export const createReserva = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        await client.query('SET auditoria.usuario_id = $1', [req.user.id]);

        const pasajeroId = parseInt(req.user.id);
        const viajeId = parseInt(req.body.viajeId, 10); 

        if (!viajeId) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "El ID del viaje es requerido." });
        }
        const viaje = await viajeModel.getById(viajeId);
        if (!viaje) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "El viaje no existe." });
        }
        if (viaje.estado !== 'PROGRAMADO') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Este viaje no se puede reservar porque no está programado." });
        }
        if (viaje.id_conductor === pasajeroId) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: "Acción prohibida: no puedes reservar en tu propio viaje." });
        }

        const reservasActuales = await reservaModel.findByViajeId(viajeId);
        if (reservasActuales.length >= viaje.asientos_ofrecidos) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: "Conflicto: no quedan asientos disponibles en este viaje." });
        }

        const newReserva = await reservaModel.create(viajeId, pasajeroId, client);

        await client.query('COMMIT');

        res.status(201).json({
            message: "Reserva creada exitosamente",
            data: newReserva
        });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        if (error.code === '23505') { 
            return res.status(409).json({ message: "Conflicto: ya tienes una reserva en este viaje." });
        }
        res.status(500).json({
            message: "Error interno del servidor al crear la reserva",
            error: error.message
        });
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getReservasByUser = async(req, res) => {
    try {
        const reservas = await reservaModel.findByPasajeroId(req.user.id);
        res.status(200).json({
            message: "Reservas obtenidas exitosamente",
            data: reservas
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener mis reservas",
            error: error.message
        })
    }
}

export const deleteReserva = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        await client.query('SET auditoria.usuario_id = $1', [req.user.id]);

        const viajeId = parseInt(req.params.id, 10); 
        const pasajeroId = req.user.id; 

        const reservaEliminada = await reservaModel.delete(viajeId, pasajeroId, client);

        if (!reservaEliminada) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "No se encontró una reserva para este usuario en este viaje." });
        }
        
        await client.query('COMMIT');

        res.status(200).json({
            message: "Reserva eliminada exitosamente",
            data: reservaEliminada
        });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        res.status(500).json({
            message: "Error al eliminar la reserva",
            error: error.message
        });
    } finally {
        if (client) {
            client.release();
        }
    }
};
