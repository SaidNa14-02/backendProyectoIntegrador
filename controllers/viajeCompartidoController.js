import ViajeCompartido from "../models/viajeCompartidoModel.js";
import jwt from "jsonwebtoken";
const viajeCompartidoModel = new ViajeCompartido();

export const createViajeCompartido = async (req, res) => {
  try {
    const id_conductor = req.user.id;
    const datosViaje = {
      ...req.body,
      conductor_id: id_conductor
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
    if (viajes.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay viajes compartidos disponibles" });
    }
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
    const viajeId = req.params.id;
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
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el elemento",
      error: error.message,
    });
  }
};

export const deleteViajeCompartido = async (req, res) => {
  try {
    const viajeId = req.params.id;
    const conductorIdDelToken = req.user.id;

    const viajeExistente = await viajeCompartidoModel.getById(viajeId);
    if (!viajeExistente) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }
    if (viajeExistente.id_conductor !== conductorIdDelToken) {
      return res
        .status(403)
        .json({
          message: "Prohibido: No tienes permiso para eliminar este viaje.",
        });
    }
    const viajeEliminado = await viajeCompartidoModel.deleteViajeCompartido(
      viajeId
    );
    if (!viajeEliminado) {
      return res.status(404).json({
        message: "Viaje compartido no encontrado",
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
  const viajeId = req.params.id;
  const conductorIdDelToken = req.user.id;
  try {
    const viajeExistente = await viajeCompartidoModel.getById(viajeId);
    if (!viajeExistente) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }
    if (viajeExistente.id_conductor !== conductorIdDelToken) {
      return res
        .status(403)
        .json({
          message: "Prohibido: No tienes permiso para modificar este viaje.",
        });
    }

    const viajeActualizado = await viajeCompartidoModel.updateViajeById(
      viajeId,
      req.body
    );
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
