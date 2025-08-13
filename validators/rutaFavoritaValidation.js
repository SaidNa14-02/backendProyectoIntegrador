import { body, param } from 'express-validator';

export const guardarRutaFavoritaValidate = [
    body('rutaId')
        .notEmpty().withMessage('El ID de la ruta es requerido.')
        .isInt({ min: 1 }).withMessage('El ID de la ruta debe ser un número entero positivo.'),
];

export const eliminarRutaFavoritaValidate = [
    param('rutaId')
        .notEmpty().withMessage('El ID de la ruta es requerido en los parámetros.')
        .isInt({ min: 1 }).withMessage('El ID de la ruta debe ser un número entero positivo.'),
];

export const checkRutaFavoritaValidate = [
    param('rutaId')
        .notEmpty().withMessage('El ID de la ruta es requerido en los parámetros.')
        .isInt({ min: 1 }).withMessage('El ID de la ruta debe ser un número entero positivo.'),
];
