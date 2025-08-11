import express from 'express';
import {createUsuario, getAllUsuarios, deleteUsuario, updateUsuario, loginUsuario, changePassword, getMyProfile} from '../controllers/usuarioController.js'
import { isauthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', createUsuario);
router.get('/', isauthenticated, getAllUsuarios);
router.delete('/:id', isauthenticated, deleteUsuario);
router.patch('/:id', isauthenticated, updateUsuario);
router.patch('/me/password', isauthenticated, changePassword);
router.get('/me/profile', isauthenticated, getMyProfile);
router.post('/login', loginUsuario);
export default router;