import express from 'express';
import { createViajeCompartido, getAllViajesCompartidos, deleteViajeCompartido, updateViajeCompartido, getViajeCompartidoByUserId, getViajeCompartidoById, listarPasajerosDeRuta, searchViajes} from '../controllers/viajeCompartidoController.js';
import { isauthenticated } from '../middleware/authMiddleware.js';
import { createViajeCompartidoValidate, updateViajeCompartidoValidate } from '../validators/viajeCompartidoValidation.js';

const router = express.Router();

router.post('/', isauthenticated, createViajeCompartidoValidate, createViajeCompartido);
router.get('/', isauthenticated, getAllViajesCompartidos);
router.get('/search', isauthenticated, searchViajes);
router.get('/:id', isauthenticated, getViajeCompartidoById)
router.get('/my/viajes', isauthenticated, getViajeCompartidoByUserId);
router.delete('/:id', isauthenticated, deleteViajeCompartido);
router.patch('/:id', isauthenticated, updateViajeCompartidoValidate, updateViajeCompartido);
router.get('/:id/passengers', isauthenticated, listarPasajerosDeRuta); // New route

export default router;
