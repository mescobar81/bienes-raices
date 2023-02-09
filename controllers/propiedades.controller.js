import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad, Usuario } from '../models/index.js';


const admin = async (req, res) => {

    const id = req.usuario.id;
    const propiedades = await Propiedad.findAll({
        where: {
            id_usuario: id
        },
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });


    res.render('propiedades/admin', {
        titulo: 'Mis propiedades',
        csrfToken: req.csrfToken(),
        propiedades
    });
}

const crear = async (req, res) => {

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        titulo: 'Crear Propiedad',
        categorias: categorias,
        precios: precios,
        csrfToken: req.csrfToken(),
        datos: {}
    });
}

const guardar = async (req, res) => {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            titulo: 'Crear Propiedad',
            categorias: categorias,
            precios: precios,
            errors: resultado.array(),
            csrfToken: req.csrfToken(),
            datos: req.body
        });
    }


    const { tituloProp: titulo, descripcion, categoria, precio, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;
    const { id: id_usuario } = req.usuario;
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
            imagen: '',
            id_categoria: categoria,
            id_precio: precio,
            id_usuario,
        });

        res.redirect(`/bienes-raices/propiedades/agregar-imagen/${nuevaPropiedad.id_usuario}`);
    } catch (error) {
        console.log(error);
    }

}

const agregarImagen = async (req, res) => {

    const { id } = req.params;
    //validar que la propiedad exista

    try {
        const propiedad = await Propiedad.findByPk(id);
        console.log(propiedad);
        if (!propiedad) {
            return res.redirect('/bienes-raices/mis-propiedades');
        }

        //validar que la propiedad no este publicada
        if (propiedad.publicado) {
            return res.redirect('/bienes-raices/mis-propiedades');
        }

        //validar que la propiedad pertenece a quien visita esta pagina
        if (req.usuario.id.toString() !== propiedad.id_usuario.toString()) {
            return res.redirect('/bienes-raices/mis-propiedades');
        }
        res.render('propiedades/agregar-imagen', {
            titulo: `Agregar Imagen: ${propiedad.titulo}`,
            csrfToken: req.csrfToken(),
            propiedad
        });
    } catch (error) {
        console.log(error);
        return res.redirect('/bienes-raices/mis-propiedades');
    }
}

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params;
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }

    //validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }

    //validar que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.id_usuario.toString()) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }
    res.render('propiedades/agregar-imagen', {
        titulo: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    });


    try {
        console.log(req.file);

        //almacenar la imagen y publicar la propiedad para
        propiedad.imagen = req.file.filename;
        propiedad.publicado = 1;

        await propiedad.save();

        next();
    } catch (error) {
        console.log(error);
        return res.redirect('/bienes-raices/mis-propiedades');
    }
}

const editar = async (req, res) => {

    const id = req.params.id;
    console.log('ID: ' + id);
    //validar que la propiedad exista
    let propiedad = null;
    try {
        propiedad = await Propiedad.findByPk(id);

        if (!propiedad) {
            return res.redirect('/bienes-raices/mis-propiedades');
        }
        //return res.render('')
    } catch (error) {
        console.log(error);
        return res.redirect('/bienes-raices/mis-propiedades');
    }

    if (propiedad.id_usuario.toString() !== req.usuario.id.toString()) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    console.log('PROPIEDAD: ', propiedad.titulo);
    res.render('propiedades/editar', {
        titulo: `Editar Propiedad: ${propiedad.titulo}`,
        categorias: categorias,
        precios: precios,
        csrfToken: req.csrfToken(),
        datos: propiedad
    });
}
const guardarCambios = async (req, res) => {

    //verificar la validacion
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/editar', {
            titulo: `Editar Propiedad: ${propiedad.titulo}`,
            categorias: categorias,
            precios: precios,
            errors: resultado.array(),
            csrfToken: req.csrfToken(),
            datos: req.body
        });
    }

    const id = req.params.id;
    const propiedad = await Propiedad.findByPk(id);

    if (propiedad.id_usuario.toString() !== req.usuario.id.toString()) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }


    try {
        const { titulo, descripcion, categoria, precio, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            id_precio:precio,
            id_categoria:categoria
        });
        await propiedad.save();
        return res.redirect('/bienes-raices/mis-propiedades');
    } catch (error) {
        console.log(error);
    }

}

const eliminar = async (req, res)=>{
    const id = req.params.id;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }

    if (propiedad.id_usuario.toString() !== req.usuario.id.toString()) {
        return res.redirect('/bienes-raices/mis-propiedades');
    }

    //eliminar imagen de la propiedad almacenada en el disco 
    //ver: carpeta /public/uploads

    await unlink(`public/uploads/${propiedad.imagen}`);

    //eliminar una propiedad
    propiedad.destroy();
    res.redirect('/bienes-raices/mis-propiedades');
}

//muestra una propiedad para el acceso publico
const mostrarPropiedad = async (req, res)=>{

    const { id } = req.params;

    //validar que una propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include:[
            {model: Categoria, as:'categoria'},
            {model: Precio, as:'precio'}
        ]
    });

    console.log(propiedad);
    res.render('propiedades/mostrar', {
        propiedad
    })
    /* if(!propiedad){
        return res.redirect('/404');
    }

    res.render('propiedades/mostrar', {
        titulo: propiedad.titulo,
        propiedad
    }); */
};

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}