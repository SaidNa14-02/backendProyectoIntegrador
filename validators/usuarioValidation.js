import {body} from 'express-validator';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

const usuarioModel = new Usuario();

export const usuarioValidate = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
        .isAlpha('es-ES', {ignore: ' '}).withMessage('El nombre solo debe contener letras y espacios'),

    body('correo')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email debe ser válido')
        .custom(value =>{
            if(!value.endsWith('puce.edu.ec')){
                throw new Error('Solo se permiten correos institucionales de la PUCE');
            }
            return true;
        }),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
        .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'),
    
    body('conductor')
        .optional()
        .isBoolean().withMessage('El conductor debe ser un valor booleano'),

    body('placa')
        .optional()
        .isLength({ min: 6, max: 7 }).withMessage('La placa debe tener entre 6 y 7 caracteres')
        .matches(/^[A-Z]{3}-\d{4}$/).withMessage('La placa debe seguir el formato AAA-0000')
        .custom((value, { req }) => {
            if (req.body.conductor && !value) {
                throw new Error('La placa es obligatoria si el usuario es conductor');
            }
            return true;
        }),

    body('capacidadvehiculo')
        .optional()
        .isInt({ min: 1, max: 7 }).withMessage('La capacidad del vehículo debe ser un número entre 1 y 7')
        .custom((value, { req }) => {
            if (req.body.conductor && !value) {
                throw new Error('La capacidad del vehículo es obligatoria si el usuario es conductor');
            }
            return true;
        }),

    
        
]

export const updateProfileValidate = [
    body('nombre')
        .optional()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
        .isAlpha('es-ES', {ignore: ' '}).withMessage('El nombre solo debe contener letras y espacios'),
    
    body('correo')
        .optional()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email debe ser válido')
        .custom(value =>{
            if(!value.endsWith('puce.edu.ec')){
                throw new Error('Solo se permiten correos institucionales de la PUCE');
            }
            return true;
        }),
    
    body('placa')
        .optional()
        .isLength({ min: 6, max: 7 }).withMessage('La placa debe tener entre 6 y 7 caracteres') 
        .matches(/^[A-Z]{3}-\d{4}$/).withMessage('La placa debe seguir el formato AAA-0000')
        .custom((value, { req }) => {
            if (req.body.conductor && !value) {
                throw new Error('La placa es obligatoria si el usuario es conductor');
            }
            return true;
        }),
    
    body('capacidadvehiculo')
        .optional()
        .isInt({ min: 1, max: 7 }).withMessage('La capacidad del vehículo debe ser un número entre 1 y 7')
        .custom((value, { req }) => {
            if (req.body.conductor && !value) {
                throw new Error('La capacidad del vehículo es obligatoria si el usuario es conductor');
            }
            return true;
        }),
    
    body('conductor')
        .optional()
]

export const changePasswordValidate = [
    body('newPassword')
        .notEmpty().withMessage('La nueva contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
        .withMessage('La nueva contraseña debe contener al menos una letra mayúscula, una minúscula y un número')
        .custom(async (value, { req }) => {
            const userId = req.user.id;
            const usuario = await usuarioModel.getById(userId);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            const isMatch = await bcrypt.compare(value, usuario.password_hash);
            if (isMatch) {
                throw new Error('La nueva contraseña no puede ser la misma que la actual');
            }
            return true;
        })
]

export const loginValidate = [
    body('correo')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email debe ser válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
]   