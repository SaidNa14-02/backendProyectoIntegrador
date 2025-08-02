import express from 'express';
import {createUsuario, getAllUsuarios, deleteUsuario, updateUsuario, loginUsuario} from '../controllers/usuarioController.js'

const router = express.Router();

router.post('/', createUsuario);
router.get('/', getAllUsuarios);
router.delete('/:id', deleteUsuario);
router.put('/:id', updateUsuario);
router.post('/login', loginUsuario);
export default router;