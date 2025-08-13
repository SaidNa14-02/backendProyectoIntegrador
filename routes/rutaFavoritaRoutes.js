import express from 'express';
import { isauthenticated } from '../middleware/authMiddleware.js';
import { guardarRutaFavorita, obtenerRutasFavoritas, eliminarRutaFavorita, checkRutaFavorita } from '../controllers/rutaFavoritaController.js';
import { guardarRutaFavoritaValidate, eliminarRutaFavoritaValidate, checkRutaFavoritaValidate } from '../validators/rutaFavoritaValidation.js';

const router = express.Router();

router.post('/', isauthenticated, guardarRutaFavoritaValidate, guardarRutaFavorita);
router.get('/', isauthenticated, obtenerRutasFavoritas);
router.delete('/:rutaId', isauthenticated, eliminarRutaFavoritaValidate, eliminarRutaFavorita);
router.get('/check/:rutaId', isauthenticated, checkRutaFavoritaValidate, checkRutaFavorita);

export default router;
