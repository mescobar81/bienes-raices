import {check, validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';

const login = (req, res) =>{
    res.render('auth/login', {
        titulo:'Iniciar Sesión'
    });
}

const registro = (req, res) =>{
    res.render('auth/registro', {
        titulo:'Crear Cuenta'
    });
}

const restaurarPassword = (req, res)=>{
    res.render('auth/restaurar-password', {
        titulo:'Restaurar Contraseña'
    });
};

const registrar = async (req, res)=>{

    await check('nombre').notEmpty().withMessage('El nombre no puede quedar vacio').run(req);
    let resultado = validationResult(req, res);
    console.log(resultado);
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
};

export {
    login,
    registro,
    registrar,
    restaurarPassword
}