import express from 'express';
import {createReserva, getReservasByUser, deleteReserva} from '../controllers/reservaController.js'; 
import { isauthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registerok, a', isauthenticated, createReserva);
router.get('/', isauthenticated, getReservasByUser);;
router.delete('/:id', isauthenticated, deleteReserva);
export default router;