
const login = (req, res) =>{
    res.render('auth/login', {
        titulo:'Iniciar Sesión'
    });
}

const registrar = (req, res) =>{
    res.render('auth/registro', {
        titulo:'Crear Cuenta'
    });
}

const restaurarPassword = (req, res)=>{
    res.render('auth/restaurar-password', {
        titulo:'Restaurar Contraseña'
    });
};

export {
    login,
    registrar,
    restaurarPassword
}