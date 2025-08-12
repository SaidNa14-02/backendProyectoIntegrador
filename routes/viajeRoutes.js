import express from 'express';
import { createViajeCompartido, getAllViajesCompartidos, deleteViajeCompartido, updateViajeCompartido, getViajeCompartidoByUserId, getViajeCompartidoById, listarPasajerosDeRuta} from '../controllers/viajeCompartidoController.js';
import { isauthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', isauthenticated, createViajeCompartido);
router.get('/', getAllViajesCompartidos);
router.get('/:id', getViajeCompartidoById)
router.get('/my/viajes', isauthenticated, getViajeCompartidoByUserId);
router.delete('/:id', isauthenticated, deleteViajeCompartido);
router.patch('/:id', isauthenticated, updateViajeCompartido);
router.get('/:id/passengers', isauthenticated, listarPasajerosDeRuta); // New route

export default router;
