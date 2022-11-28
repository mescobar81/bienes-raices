import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import {generarId, generarToken} from '../helpers/token.js';
import { emailNuevoPassword, emailRegistro } from '../helpers/email.js';
import Usuario from '../models/Usuario.js';

const login = (req, res) => {
    res.render('auth/login', {
        titulo: 'Iniciar Sesión',
        csrfToken:req.csrfToken()
    });
}

const autenticar = async (req, res) =>{

    await check('email').isEmail().withMessage('El email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatorio').run(req);

    const resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            titulo:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors:resultado.array()
        });
    }

    const {email, password} = req.body;
    //validar que el usuario exista
    const usuario = await Usuario.findOne({where:{email}});
    if(!usuario){
        return res.render('auth/login', {
            titulo:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors:[{msg:'El usuario no existe'}]
        });
    }

    //vaidar si el usuario confirmo su cuenta

    if(!usuario.confirmado){
        return res.render('auth/login', {
            titulo:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors:[{msg:'El usuario no esta confirmado'}]
        });
    }

    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            titulo:'Iniciar Sesión',
            csrfToken:req.csrfToken(),
            errors:[{msg:'Credenciales inválidas'}]
        });
    }

    const token = generarToken({id:usuario.id, nombre:usuario.nombre});

    //almacenar el token en cookies

    return res.cookie('_token', token, {
        httpOnly:true
    }).redirect('/bienes-raices/propiedades/crear');

};

const registro = (req, res) => {
    
    res.render('auth/registro', {
        titulo: 'Crear Cuenta',
        csrfToken: req.csrfToken() //genera un token para este formulario de registro
    });
}

const restaurarPassword = (req, res) => {
    res.render('auth/restaurar-password', {
        titulo: 'Restaurar Contraseña',
        csrfToken: req.csrfToken()
    });
};


const resetPassword = async (req, res) =>{
    await check('email').isEmail().withMessage('Formato de email incorrecto').run(req);

    const resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/restaurar-password', {
            titulo: 'Restaurar Contraseña', 
            csrfToken: req.csrfToken(),
            errors:resultado.array()
        });
    }

    //averiguar si un usuario existe en la bd
    const {email} = req.body;
    const usuario = await Usuario.findOne({where: {email}});

    if(!usuario){
        return res.render('auth/restaurar-password', {
            titulo: 'Restaurar Contraseña', 
            csrfToken: req.csrfToken(),
            errors:[{msg:'El email introducido no existe'}]
        });
    }

    //generar un nuevo token
    usuario.token = generarId();
    usuario.save();//guardamos el nuevo token en la bd

    //enviar un email para notificar al usuario del cambio de password
    emailNuevoPassword({
        email:usuario.email,
        nombre:usuario.nombre,
        token:usuario.token
    });

    //renderiza el mensaje al usuario del cambio del  nuevo password
    res.render('templates/mensaje', {
        titulo:'Restablece tu password',
        mensaje:'Hemos enviado un email con las instrucciones'
    });

}

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
            usuario: req.body,
            csrfToken:req.csrfToken()
        });
    }

    if(password != repetir_password){
        return res.render('auth/registro', {
            titulo: 'Crear Cuenta',
            errors: [{
                msg: 'Las contraseñas no coinciden',
            }],
            usuario: req.body,
            csrfToken:req.csrfToken()
        });
    }

    const existeUsuario = await Usuario.findOne({where: { email }});
    if (existeUsuario) {
        return res.render('auth/registro', {
            titulo: 'Crear Cuenta',
            errors: [{
                msg: 'Ya existe un usuario con ese email'
            }],
            usuario:req.body,
            csrfToken:req.csrfToken()
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

    //renderiza la pagina de mensaje que fue exitoso la creacion de usuario
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

const comprobarToken = async (req, res) =>{
    
    const {token} = req.params;
    const usuario = await Usuario.findOne({where:{token}});

    if(!usuario){
        return res.render('auth/confirmar-email', {
            titulo:'Restablece tu password',
            mensaje:'Hubo un error al validar tu información, intenta de nuevo',
            error:true
        });
    }

    //renderizar vista de cambiar contraseña
    res.render('auth/cambiar-password', {
        titulo:'Restablece tu Password',
        csrfToken:req.csrfToken()
    });

}

const nuevoPassword = async (req, res) =>{
    await check('password').isLength({min: 6})
    .withMessage('La constraesña debe tener un mínimo de 6 caracteres').run(req);

    const resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/cambiar-password',{
            titulo:'Restaurar Password',
            errors:resultado.array(),
            csrfToken:req.csrfToken()
        });
    }
    const token = req.params.token;
    console.log(token);
    const {password} = req.body;
    const usuario = await Usuario.findOne({where: {token}});

    //hashear de nuevo el password cambiado
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    usuario.token = null;
    usuario.save();

    res.render('templates/mensaje', {
        titulo:'Password restablecido',
        mensaje:'El password se guardó correctamente'
    });

}

export {
    login,
    autenticar,
    registro,
    registrar,
    confirmar,
    restaurarPassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}