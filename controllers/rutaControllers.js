import Ruta from "../models/Ruta.js";

const rutaModel = new Ruta();

export const createRuta = async (req, res) => {
  try {
    const creadorId = req.user.id;
    //Añade el el id a la propiedad creador_id del body
    const datosRuta = {
      ...req.body,
      creador_id: creadorId,
    };
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

export const getRutas = async (req, res) => {
  try {
    const rutas = await rutaModel.findAll();
    res.status(200).json({
      message: "Rutas obtenidas exitosamente",
      data: rutas,
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
    const rutaId = req.params.id;
    const creadorIdDelToken = req.user.id;

    const rutaEliminada = await rutaModel.deleteById(rutaId, creadorIdDelToken);
    if (!rutaEliminada) {
      return res.status(404).json({
        message: "Ruta no encontrada o no eres el cradeador de esta ruta.",
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
  try {
    const rutaId = req.params.id;
    const body = req.body;
    const creadorIdDelToken = req.user.id;
    const rutaExistente = await rutaModel.findById(rutaId);
    if (!rutaExistente) {
        return res.status(404).json({ message: "Ruta no encontrada" });
    }
    
    if (rutaExistente.creador_id !== creadorIdDelToken) {
        return res.status(403).json({ message: "Prohibido: No eres el creador de esta ruta." });
    }
    const rutaActualizada = await rutaModel.updateById(rutaId, body);
    if (!rutaActualizada) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }
    res.status(200).json({ message: "Ruta actualizada correctamente",
        data: rutaActualizada 
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la ruta",
      error: error.message,
    });
  }
};
