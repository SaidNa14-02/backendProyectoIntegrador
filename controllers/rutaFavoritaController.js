import RutasFavoritas from "../models/RutasGuardadas.js";
import { validationResult } from 'express-validator';

const rutasFavoritasModel = new RutasFavoritas();

export const guardarRutaFavorita = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rutaId } = req.body;
        const usuarioId = req.user.id;

        const rutaGuardada = await rutasFavoritasModel.guardarRuta(rutaId, usuarioId);
        res.status(201).json({
            message: "Ruta agregada a favoritos con exito",
            data: rutaGuardada
        });
    } catch (error) {
        console.error("Error al guardar la ruta favorita: ", error);
        if (error.code === '23505') {
            return res.status(409).json({ message: "Esta ruta ya ha sido guardada por el usuario." });
        }
        res.status(500).json({ message: "Error interno del servidor al guardar la ruta favorita", error: error.message });
    }
};

export const obtenerRutasFavoritas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const rutasFavoritas = await rutasFavoritasModel.findRutasGuardadasByUsuario(usuarioId);
        res.status(200).json({
            message: "Rutas favoritas obtenidas con exito",
            data: rutasFavoritas
        });
    } catch (error) {
        console.error("Error al obtener las rutas favoritas: ", error);
        res.status(500).json({ message: "Error interno del servidor al obtener las rutas favoritas", error: error.message });
    }
};

export const eliminarRutaFavorita = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rutaId } = req.params;
        const usuarioId = req.user.id;

        const rutaEliminada = await rutasFavoritasModel.eliminarRutaGuardada(parseInt(rutaId), usuarioId);

        if (!rutaEliminada) {
            return res.status(404).json({ message: "Ruta favorita no encontrada o no estaba guardada por este usuario." });
        }
        res.status(200).json({
            message: "Ruta favorita eliminada con exito",
            data: rutaEliminada
        });
    } catch (error) {
        console.error("Error al eliminar la ruta favorita: ", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar la ruta favorita", error: error.message });
    }
};

export const checkRutaFavorita = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { rutaId } = req.params;
        const usuarioId = req.user.id;

        const isSaved = await rutasFavoritasModel.findRutaGuardada(parseInt(rutaId), usuarioId);

        res.status(200).json({
            message: 'Estado de la ruta favorita obtenido exitosamente.',
            isSaved: !!isSaved
        });
    } catch (error) {
        console.error('Error al verificar el estado de la ruta favorita:', error);
        res.status(500).json({ message: 'Error interno del servidor al verificar el estado de la ruta favorita.' });
    }
};