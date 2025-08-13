import {body} from 'express-validator';

export const createViajeCompartidoValidate = [
    body('origen')
        .notEmpty().withMessage('El origen es obligatorio'),
    body('destino')
        .notEmpty().withMessage('El destino es obligatorio'),
    body('fecha_hora_salida')
        .notEmpty().withMessage('La fecha y hora de salida son obligatorias')
        .isISO8601().withMessage('Formato de fecha y hora inválido'),
    body('asientos_ofrecidos')
        .notEmpty().withMessage('El número de asientos ofrecidos es obligatorio')
        .isInt({ min: 1 }).withMessage('El número de asientos debe ser un entero mayor que 0'),
];

export const updateViajeCompartidoValidate = [
    body('origen')
        .optional()
        .notEmpty().withMessage('El origen no puede estar vacío'),
    body('destino')
        .optional()
        .notEmpty().withMessage('El destino no puede estar vacío'),
    body('fecha_hora_salida')
        .optional()
        .isISO8601().withMessage('Formato de fecha y hora inválido'),
    body('asientos_ofrecidos')
        .optional()
        .isInt({ min: 1 }).withMessage('El número de asientos debe ser un entero mayor que 0'),
    body('estado')
        .optional()
        .notEmpty().withMessage('El estado no puede estar vacío')
        .isIn(['PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO']).withMessage('Valor de estado no válido'),
];
