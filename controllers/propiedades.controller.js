import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad} from '../models/index.js';


const admin = (req, res) =>{
    res.render('propiedades/admin', {
        titulo:'Mis propiedades'
    });
}

const crear = async(req, res) =>{

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear',{
        titulo:'Crear Propiedad',
        categorias:categorias,
        precios:precios,
        csrfToken:req.csrfToken(),
        datos:{}
    });
}

const guardar = async (req, res)=>{
    const resultado = validationResult(req);
    if(!resultado.isEmpty()){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear',{
            titulo:'Crear Propiedad',
            categorias:categorias,
            precios:precios,
            errors:resultado.array(),
            csrfToken:req.csrfToken(),
            datos:req.body
        });
    }


    const {tituloProp:titulo, descripcion, categoria, precio, habitaciones, estacionamiento, wc, calle, lat, lng} = req.body;
    const { id: id_usuario} = req.usuario;
    try {
        const nuevaPropiedad = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            imagen:'',
            id_categoria: categoria,
            id_precio:precio,
            id_usuario,
        });

        res.redirect(`/propiedades/agregar-imagen/${nuevaPropiedad.id_usuario}`);
    } catch (error) {
        console.log(error);
    }
    
}

const agregarImagen = async (req, res) =>{
    res.render('propiedades/agregar-imagen', {
        titulo:'Agregar Imagen'
    });
}
export {
    admin,
    crear,
    guardar,
    agregarImagen
}