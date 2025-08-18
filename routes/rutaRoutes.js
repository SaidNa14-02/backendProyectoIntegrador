import express from 'express';
import {createRuta, getRutas, deleteRuta, updateRuta, getRutaById, getMyRutas} from '../controllers/rutaControllers.js'
import { isauthenticated } from '../middleware/authMiddleware.js';
import { createRutaValidate, updateRutaValidate } from '../validators/rutaValidation.js';

const router = express.Router();

router.post('/', isauthenticated, createRutaValidate, createRuta);
router.get('/', isauthenticated, getRutas);
router.delete('/:id', isauthenticated, deleteRuta);
router.put('/:id', isauthenticated, updateRutaValidate, updateRuta);
router.get('/me', isauthenticated, getMyRutas);
router.get('/:id', isauthenticated, getRutaById);

export default router;