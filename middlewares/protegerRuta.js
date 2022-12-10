import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';


const portegerRuta = async (req, res, next) =>{
    
    //verificar si hay un token
    const {_token} = req.cookies;

    if(!_token){
        return res.redirect('/bienes-raices/auth/login');
    }

    //comprobar el token
    try {
        const decode = jwt.verify(_token, process.env.TOKEN_SECRET);
        console.log(decode.id);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decode.id);

        console.log(usuario);
        if(usuario){
            req.usuario = usuario;
        } else {
            res.redirect('/bienes-raices/auth/login');
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/bienes-raices/auth/login');
    }
}

export default portegerRuta;