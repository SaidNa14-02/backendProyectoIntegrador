import express from 'express';
import {createUsuario, getAllUsuarios, deleteUsuario, updateUsuario} from '../controllers/usuarioController.js'

const router = express.Router();

router.post('/', createUsuario);
router.get('/', getAllUsuarios);
router.delete('/:id', deleteUsuario);
router.put('/:id', updateUsuario);

export default router;