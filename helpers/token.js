import jwt from 'jsonwebtoken';

const generarToken = (datos) => {

    //crear un jwt para autenticacion
    return jwt.sign({
        id:datos.id,
        nombre: datos.nombre
    }, process.env.TOKEN_SECRET,
        {
            expiresIn: '1d'
        });

}

const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarToken,
    generarId
}