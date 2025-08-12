import ViajeCompartido from "../models/ViajeCompartido.js";
import jwt from "jsonwebtoken";
import Reserva from '../models/Reserva.js'; // New import
import { validationResult } from 'express-validator';

const viajeCompartidoModel = new ViajeCompartido();
const reservaModel = new Reserva(); // New instance

export const createViajeCompartido = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id_conductor = req.user.id;
    const datosViaje = {
      ...req.body,
      id_conductor: id_conductor
    };
    const newViaje = await viajeCompartidoModel.createViajeCompartido(datosViaje);
    res.status(201).json({
      message: "Viaje compartido creado con éxito",
      data: newViaje,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el viaje compartido",
      error: error.message,
    });
  }
};

export const getAllViajesCompartidos = async (req, res) => {
  try {
    const viajes = await viajeCompartidoModel.getAllViajesCompartidos();
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
  try {
    const viajeId = parseInt(req.params.id);
    const conductorIdDelToken = req.user.id;

    const viajeEliminado = await viajeCompartidoModel.deleteViajeCompartidoById(
      viajeId,
      conductorIdDelToken
    );

    if (!viajeEliminado) {
      return res.status(404).json({
        message: "Viaje no encontrado o no tienes permiso para eliminarlo.",
      });
    }
    
    res.status(200).json({
      message: "Viaje compartido eliminado con éxito",
      data: viajeEliminado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el viaje compartido",
      error: error.message,
    });
  }
};

export const updateViajeCompartido = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const viajeId = parseInt(req.params.id);
  const conductorIdDelToken = req.user.id;
  try {
    const viajeActualizado = await viajeCompartidoModel.updateViajeById(
      viajeId,
      req.body,
      conductorIdDelToken
    );

    if (!viajeActualizado) {
      return res.status(404).json({
        message: "Viaje no encontrado, no tienes permiso para modificarlo, o no se enviaron datos válidos.",
      });
    }

    res.status(200).json({
      message: "Viaje compartido actualizado con éxito",
      data: viajeActualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el viaje compartido",
      error: error.message,
    });
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
