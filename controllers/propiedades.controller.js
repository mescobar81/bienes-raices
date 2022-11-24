import { validationResult } from "express-validator";
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
        precios:precios,
        csrfToken:req.csrfToken(),
        datos:{}
    });
}

const guardar = async (req, res)=>{
    const resultado = validationResult(req);
    console.log(req.body);
    if(!resultado.isEmpty()){
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear',{
            titulo:'Crear Propiedad',
            mostrarBarra:true,
            categorias:categorias,
            precios:precios,
            errors:resultado.array(),
            csrfToken:req.csrfToken(),
            datos:req.body
        });
    }

    res.render('propiedades/crear',{
        titulo:'Crear Propiedad',
        mostrarBarra:true,
        csrfToken:req.csrfToken()
    });
}

export {
    admin,
    crear,
    guardar
}