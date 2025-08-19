import pool from '../src/db.js';
import ViajeCompartido from "../models/ViajeCompartido.js";
import jwt from "jsonwebtoken";
import Reserva from '../models/Reserva.js'; 
import { validationResult } from 'express-validator';
import { geocodeAddress } from '../utils/nominatimService.js';

const viajeCompartidoModel = new ViajeCompartido();
const reservaModel = new Reserva(); 

export const createViajeCompartido = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const userIdForAudit = req.user && req.user.id ? parseInt(req.user.id, 10) : null;
    if (userIdForAudit === null) {
      await client.query('SET auditoria.usuario_id = NULL');
    } else {
      await client.query('SET auditoria.usuario_id = $1', [userIdForAudit]);
    }

    const id_conductor = req.user.id;
    const datosViaje = {
      ...req.body,
      id_conductor: id_conductor
    };

    // Geocodificar origen si no se proporcionan coordenadas
    if (datosViaje.origen && (datosViaje.origen_lat == null || datosViaje.origen_lon == null)) {
      const coords = await geocodeAddress(datosViaje.origen);
      if (coords) {
        datosViaje.origen_lat = coords.lat;
        datosViaje.origen_lon = coords.lon;
      } else {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: "No se pudo geocodificar el origen." });
      }
    }

    // Geocodificar destino si no se proporcionan coordenadas
    if (datosViaje.destino && (datosViaje.destino_lat == null || datosViaje.destino_lon == null)) {
      const coords = await geocodeAddress(datosViaje.destino);
      if (coords) {
        datosViaje.destino_lat = coords.lat;
        datosViaje.destino_lon = coords.lon;
      } else {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: "No se pudo geocodificar el destino." });
      }
    }

    const newViaje = await viajeCompartidoModel.createViajeCompartido(datosViaje, client);
    
    await client.query('COMMIT');

    res.status(201).json({
      message: "Viaje compartido creado con éxito",
      data: newViaje,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res.status(500).json({
      message: "Error al crear el viaje compartido",
      error: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const getAllViajesCompartidos = async (req, res) => {
  try {
    const viajes = await viajeCompartidoModel.getViajesCompartidos();
    res.status(200).json({
      message: "Viajes compartidos obtenidos con éxito",
      data: viajes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los viajes compartidos ",
      error: error.message,
    });
  }
};

export const getViajeCompartidoByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const viajes = await viajeCompartidoModel.getViajeCompartidoByUserId(
      userId
    );
    if (viajes.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay viajes compartidos para este usuario" });
    }
    res.status(200).json({
      message: "Viajes compartidos obtenidos con éxito",
      data: viajes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Algo salió mal al obtener los viajes compartidos del usuario",
      error: error.message,
    });
  }
};

export const getViajeCompartidoById = async (req, res) => {
  try {
    const viajeId = parseInt(req.params.id);
    const viaje = await viajeCompartidoModel.getViajeCompartidoById(viajeId);
    if (!viaje) {
      return res
        .status(404)
        .json({ message: "No se encontró el viaje compartido" });
    }
    res.status(200).json({
      message: "Viaje compartido obtenido con éxito",
      data: viaje,
    });
  } 
  catch (error) {
      res.status(500).json({
        message: "Error al obtener el elemento",
        error: error.message,
      });
    }
  };

export const deleteViajeCompartido = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const userIdForAudit = req.user && req.user.id ? parseInt(req.user.id, 10) : null;
    if (userIdForAudit === null) {
      await client.query('SET auditoria.usuario_id = NULL');
    } else {
      await client.query('SET auditoria.usuario_id = $1', [userIdForAudit]);
    }

    const viajeId = parseInt(req.params.id);
    const conductorIdDelToken = req.user.id;

    const viajeEliminado = await viajeCompartidoModel.deleteViajeCompartidoById(
      viajeId,
      conductorIdDelToken, // Pass conductorIdDelToken
      client
    );

    if (!viajeEliminado) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "Viaje no encontrado o no tienes permiso para eliminarlo.",
      });
    }
    
    await client.query('COMMIT');

    res.status(200).json({
      message: "Viaje compartido eliminado con éxito",
      data: viajeEliminado,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res.status(500).json({
      message: "Error al eliminar el viaje compartido",
      error: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const updateViajeCompartido = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const viajeId = parseInt(req.params.id);
  const conductorIdDelToken = req.user.id;
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const userIdForAudit = req.user && req.user.id ? parseInt(req.user.id, 10) : null;
    if (userIdForAudit === null) {
      await client.query('SET auditoria.usuario_id = NULL');
    } else {
      await client.query('SET auditoria.usuario_id = $1', [userIdForAudit]);
    }

    // Geocodificar origen si se está actualizando y no se proporcionan coordenadas
    if (req.body.origen && (req.body.origen_lat == null || req.body.origen_lon == null)) {
      const coords = await geocodeAddress(req.body.origen);
      if (coords) {
        req.body.origen_lat = coords.lat;
        req.body.origen_lon = coords.lon;
      } else {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: "No se pudo geocodificar el origen para la actualización." });
      }
    }

    // Geocodificar destino si se está actualizando y no se proporcionan coordenadas
    if (req.body.destino && (req.body.destino_lat == null || req.body.destino_lon == null)) {
      const coords = await geocodeAddress(req.body.destino);
      if (coords) {
        req.body.destino_lat = coords.lat;
        req.body.destino_lon = coords.lon;
      } else {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: "No se pudo geocodificar el destino para la actualización." });
      }
    }

    const viajeActualizado = await viajeCompartidoModel.updateViajeById(
      viajeId,
      req.body,
      conductorIdDelToken,
      client
    );

    if (req.body.estado) {
      await viajeCompartidoModel.updateStatus(viajeId, req.body.estado, client);
    }

    if (!viajeActualizado) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: "Viaje no encontrado, no tienes permiso para modificarlo, o no se enviaron datos válidos.",
      });
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: "Viaje compartido actualizado con éxito",
      data: viajeActualizado,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    res.status(500).json({
      message: "Error al actualizar el viaje compartido",
      error: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const listarPasajerosDeRuta = async (req, res) => {
  try {
    const viajeId = parseInt(req.params.id);
    const conductorId = req.user.id;

    const viaje = await viajeCompartidoModel.getById(viajeId);
    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado." });
    }

    if (viaje.id_conductor !== conductorId) {
      return res.status(403).json({ message: "Prohibido: No eres el conductor de este viaje." });
    }

    const pasajeros = await reservaModel.getAllUsersInReserve(viajeId);

    res.status(200).json({
      message: "Pasajeros del viaje obtenidos con éxito",
      data: pasajeros,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la lista de pasajeros del viaje",
      error: error.message,
    });
  }
};
