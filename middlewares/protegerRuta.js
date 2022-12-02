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

        const usuario = await Usuario.findByPK(decode.id);
        console.log(usuario);
    } catch (error) {
        return res.clearCookie('_token').redirect('/bienes-raices/auth/login');
    }
    next();
}

export default portegerRuta;