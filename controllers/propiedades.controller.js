

const admin = (req, res) =>{
    res.render('propiedades/admin', {
        titulo:'Mis propiedades',
        mostrarBarra:true
    });
}

const crear = (req, res) =>{
    res.render('propiedades/crear',{
        titulo:'Crear Propiedad',
        mostrarBarra:true
    });
}

export {
    admin,
    crear
}