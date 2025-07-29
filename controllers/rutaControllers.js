import Ruta from "../models/Ruta.js"; 

const rutaModel = new Ruta();

export const createRuta = async (req, res) => {
  try {
    const newRuta = await rutaModel.create(req.body);
    res.status(201).json({ 
      message: "Ruta creada exitosamente",
      data: newRuta 
    });
  } 
  catch (error) {
    res.status(500).json({ 
      message: "Error al crear la ruta",
      error: error.message 
    });
  }
};

export const getRutas = async (req, res) => {
    try {
        const rutas = await rutaModel.findAll();
        res.status(200).json({
            message: "Rutas obtenidas exitosamente",
            data: rutas 
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener las rutas",
            error: error.message
        });
    }
};

export const deleteRuta = async (req, res) => {
    try {
        const id = req.params.id;
        const rutaEliminada = await rutaModel.deleteById(id);
        
        if (!rutaEliminada) {
            return res.status(404).json({
                message: "Ruta no encontrada"
            });
        }

        res.status(200).json({
            message: "Ruta eliminada exitosamente",
            data: rutaEliminada
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al eliminar la ruta",
            error: error.message
        });
    }
};

export const updateRuta = async(req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const rutaActualizada = await rutaModel.updateById(id, body);
        if (!rutaActualizada){
            return res.status(404).json({message: "Ruta no encontrada"});
        }
        res.status(200).json({message: "Ruta actualizada correctamente"});
    }
    catch (error) {
        res.status(500).json({
            message: "Error al actualizar la ruta",
            error: error.message
        });
    }
}