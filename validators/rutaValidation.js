import {body} from 'express-validator';

export const createRutaValidate = [
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria'),
    body('punto_inicio')
        .notEmpty().withMessage('El punto de inicio es obligatorio'),
    body('punto_destino')
        .notEmpty().withMessage('El punto de destino es obligatorio'),
    body('tipo_transporte')
        .notEmpty().withMessage('El tipo de transporte es obligatorio')
        .isIn(['BUS', 'TROLE', 'BICI', 'PIE', 'AUTO', 'OTRO']).withMessage('Tipo de transporte no válido'),
];

export const updateRutaValidate = [
    body('titulo')
        .optional()
        .notEmpty().withMessage('El título no puede estar vacío'),
    body('descripcion')
        .optional()
        .notEmpty().withMessage('La descripción no puede estar vacía'),
    body('punto_inicio')
        .optional()
        .notEmpty().withMessage('El punto de inicio no puede estar vacío'),
    body('punto_destino')
        .optional()
        .notEmpty().withMessage('El punto de destino no puede estar vacío'),
    body('tipo_transporte')
        .optional()
        .notEmpty().withMessage('El tipo de transporte no puede estar vacío')
        .isIn(['BUS', 'TROLE', 'BICI', 'PIE', 'AUTO', 'OTRO']).withMessage('Tipo de transporte no válido'),
];