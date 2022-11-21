import Categoria from "../models/categorias.js";
import Precio from "../models/precios.js";


const admin = (req, res) =>{
    res.render('propiedades/admin', {
        titulo:'Mis propiedades',
        mostrarBarra:true
    });
}

const crear = async(req, res) =>{

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear',{
        titulo:'Crear Propiedad',
        mostrarBarra:true,
        categorias:categorias,
        precios:precios
    });
}

export {
    admin,
    crear
}