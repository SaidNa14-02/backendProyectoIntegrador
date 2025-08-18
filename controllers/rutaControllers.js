import Ruta from "../models/Ruta.js";
import { validationResult } from 'express-validator';
import { geocodeAddress } from '../utils/nominatimService.js';

const rutaModel = new Ruta();

export const createRuta = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const creadorId = req.user.id;
    //Añade el el id a la propiedad creador_id del body
    const datosRuta = {
      ...req.body,
      creador_id: creadorId,
    };

    // Geocodificar punto_inicio
    if (datosRuta.punto_inicio) {
      const coords = await geocodeAddress(datosRuta.punto_inicio);
      if (coords) {
        datosRuta.punto_inicio_lat = coords.lat;
        datosRuta.punto_inicio_lon = coords.lon;
      } else {
        return res.status(400).json({ message: "No se pudo geocodificar el punto de inicio." });
      }
    }

    // Geocodificar punto_destino
    if (datosRuta.punto_destino) {
      const coords = await geocodeAddress(datosRuta.punto_destino);
      if (coords) {
        datosRuta.punto_destino_lat = coords.lat;
        datosRuta.punto_destino_lon = coords.lon;
      } else {
        return res.status(400).json({ message: "No se pudo geocodificar el punto de destino." });
      }
    }

    const newRuta = await rutaModel.create(datosRuta);
    res.status(201).json({
      message: "Ruta creada exitosamente",
      data: newRuta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la ruta",
      error: error.message,
    });
  }
};

// En controllers/rutaControllers.js

export const getRutas = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const rutasPaginadas = await rutaModel.findAll(page, limit);

    res.status(200).json({
      message: "Rutas obtenidas exitosamente",
      ...rutasPaginadas, 
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las rutas",
      error: error.message,
    });
  }
};

export const deleteRuta = async (req, res) => {
  try {
    const rutaId = parseInt(req.params.id);
    const creadorIdDelToken = req.user.id;

    const rutaEliminada = await rutaModel.deleteById(rutaId, creadorIdDelToken);
    if (!rutaEliminada) {
      return res.status(404).json({
        message: "Ruta no encontrada o no eres el creador de esta ruta.",
      });
    }

    res.status(200).json({
      message: "Ruta eliminada exitosamente",
      data: rutaEliminada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la ruta",
      error: error.message,
    });
  }
};

export const updateRuta = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const rutaId = parseInt(req.params.id);
    const body = req.body;
    const creadorIdDelToken = req.user.id;

    // Geocodificar punto_inicio si se está actualizando
    if (body.punto_inicio) {
      const coords = await geocodeAddress(body.punto_inicio);
      if (coords) {
        body.punto_inicio_lat = coords.lat;
        body.punto_inicio_lon = coords.lon;
      } else {
        return res.status(400).json({ message: "No se pudo geocodificar el punto de inicio para la actualización." });
      }
    }

    // Geocodificar punto_destino si se está actualizando
    if (body.punto_destino) {
      const coords = await geocodeAddress(body.punto_destino);
      if (coords) {
        body.punto_destino_lat = coords.lat;
        body.punto_destino_lon = coords.lon;
      } else {
        return res.status(400).json({ message: "No se pudo geocodificar el punto de destino para la actualización." });
      }
    }

    const rutaActualizada = await rutaModel.updateById(rutaId, body, creadorIdDelToken);

    if (!rutaActualizada) {
      return res.status(404).json({ 
        message: "Ruta no encontrada, no tienes permiso para modificarla, o no se enviaron datos para actualizar."
      });
    }

    res.status(200).json({ 
        message: "Ruta actualizada correctamente",
        data: rutaActualizada 
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la ruta",
      error: error.message,
    });
  }
};

export const getRutaById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ruta = await rutaModel.findById(id);

    if (!ruta) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }
    res.status(200).json({
      message: "Ruta obtenida exitosamente",
      data: ruta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la ruta",
      error: error.message,
    });
  }
};


export const getMyRutas = async (req, res) => {
  try {
    const creadorId = req.user.id; 
    const rutas = await rutaModel.findByCreatorId(creadorId);
    res.status(200).json({
      message: "Mis rutas obtenidas exitosamente",
      data: rutas,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener mis rutas",
      error: error.message,
    });
  }
};