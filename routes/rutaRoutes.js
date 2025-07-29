import express from 'express';
import {createRuta, getRutas, deleteRuta, updateRuta} from '../controllers/rutaControllers.js'

const router = express.Router();

router.post('/', createRuta);
router.get('/', getRutas);
router.delete('/:id', deleteRuta);
router.put('/:id', updateRuta);

export default router;