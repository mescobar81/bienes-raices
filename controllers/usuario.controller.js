import { check, validationResult } from 'express-validator';

import { emailRegistro } from '../helpers/email.js';
import {generarId} from '../helpers/token.js';
import Usuario from '../models/Usuario.js';

const login = (req, res) => {
    res.render('auth/login', {
        titulo: 'Iniciar Sesión'
    });
}

const registro = (req, res) => {
    res.render('auth/registro', {
        titulo: 'Crear Cuenta'
    });
}

const restaurarPassword = (req, res) => {
    res.render('auth/restaurar-password', {
        titulo: 'Restaurar Contraseña'
    });
};

const registrar = async (req, res) => {

    await check('nombre').notEmpty().withMessage('El nombre no puede quedar vacio').run(req);
    await check('email').isEmail().withMessage('Formato de email incorrecto').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser al menos de 6 caracteres').run(req);
    //await check('repetir_password').equals('password').withMessage('Las contraseñas no coinciden').run(req);


    console.log(req.body);
    let resultado = validationResult(req);
    console.log(resultado);

    const { nombre, email, password, repetir_password } = req.body;


    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            titulo: 'Crear Cuenta',
            errors: resultado.array(),
            usuario: req.body
        });
    }

    if(password != repetir_password){
        return res.render('auth/registro', {
            titulo: 'Crear Cuenta',
            errors: [{
                msg: 'Las contraseñas no coinciden',
            }],
            usuario: req.body
        });
    }

    const existeUsuario = await Usuario.findOne({where: { email }});
    if (existeUsuario) {
        return res.render('auth/registro', {
            titulo: 'Crear Cuenta',
            errors: [{
                msg: 'Ya existe un usuario con ese email'
            }],
            usuario:req.body
        });
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        repetir_password,
        token:generarId()
    });

    //enviar mail
    emailRegistro({
        nombre:usuario.nombre,
        email:usuario.email,
        token:usuario.token
    });

    //renderiza la pagina de mensaje al usuario que fue exitoso la creacion de usuario
    res.render('templates/mensaje', {
        titulo:'Cuenta creada correctamente',
        mensaje:'Hemos enviado un Email de confirmación, presiona el enlace'
    });
};

const confirmar = async (req, res)=>{

    const {token} = req.params;
    const usuario = await Usuario.findOne({where:{token}});

    if(!usuario){
        return res.render('auth/confirmar-email',{
            titulo:'Error al confirmar tu cuenta',
            mensaje:'Hubo un error al confirma tu cuenta, intenta de nuevo',
            error:true
        });
    }

    //setea el token a null y pone confirmado a true
    //ver: esto es para que no quede un token en la bd por cuestiones de seguridad

    usuario.token = null;
    usuario.confirmado = true;
    usuario.save();//guarda los cambios en la bd
    res.render('auth/confirmar-email',{
        titulo:'Cuenta confirmada',
        mensaje:'¡Tu cuenta ha sido confirmada!',
        error:false
    });

};

export {
    login,
    registro,
    registrar,
    confirmar,
    restaurarPassword
}