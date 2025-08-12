import express from 'express';
import {createUsuario, getAllUsuarios, deleteUsuario, updateUsuario, loginUsuario, changePassword, getMyProfile, getPublicProfile} from '../controllers/usuarioController.js';
import { isauthenticated } from '../middleware/authMiddleware.js';
import { usuarioValidate, updateProfileValidate, changePasswordValidate } from '../validators/usuarioValidation.js';

const router = express.Router();

router.post('/register', usuarioValidate, createUsuario);
router.get('/', isauthenticated, getAllUsuarios);
router.delete('/:id', isauthenticated, deleteUsuario);
router.patch('/:id', isauthenticated, updateProfileValidate, updateUsuario);
router.patch('/me/password', isauthenticated, changePasswordValidate, changePassword);
router.get('/me/profile', isauthenticated, getMyProfile);
router.post('/login', loginUsuario);
router.get('userprofile/:id', isauthenticated, getPublicProfile)
export default router;