import express from 'express';
import {createUsuario, deleteUsuario, updateUsuario, loginUsuario, changePassword, getMyProfile} from '../controllers/usuarioController.js';
import { isauthenticated } from '../middleware/authMiddleware.js';
import { usuarioValidate, updateProfileValidate, changePasswordValidate, loginValidate } from '../validators/usuarioValidation.js';

const router = express.Router();

router.post('/register', usuarioValidate, createUsuario);

router.delete('/:id', isauthenticated, deleteUsuario);
router.patch('/:id', isauthenticated, updateProfileValidate, updateUsuario);
router.patch('/me/password', isauthenticated, changePasswordValidate, changePassword);
router.get('/me/profile', isauthenticated, getMyProfile);
router.post('/login', loginValidate, loginUsuario);

export default router;