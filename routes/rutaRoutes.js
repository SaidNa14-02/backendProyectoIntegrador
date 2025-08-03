import express from 'express';
import {createRuta, getRutas, deleteRuta, updateRuta} from '../controllers/rutaControllers.js'
import { isauthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', isauthenticated, createRuta);
router.get('/', getRutas);
router.delete('/:id', deleteRuta);
router.put('/:id', updateRuta);

export default router;