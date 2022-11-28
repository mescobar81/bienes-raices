import {exit} from 'node:process';
import categorias from './categorias.js';
import precios from './precios.js';
import usuarios from './usuarios.js';
import {Categoria, Precio, Usuario} from '../models/index.js';
import db from '../config/db.js';

const importarDatos = async () =>{
    try {

        //nos autenticamos a la bd
       await db.authenticate();

        //generar las columnas
        await db.sync();

        //insertamos datos en la bd
        /* await Categoria.bulkCreate(categorias);
        await Precio.bulkCreate(precios); */


        //insertamos datos en la bd
        //ejecuta dos procesos en paralelo
        //ver: los procesos no deben depennder uno del otro para utilizar esta sintaxis
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos importado con éxito');
        exit(0); //finalizo con exito la ejecucion
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const eliminarDatos = async () =>{
    try {
        //dejamos como referencia, otra formma de eliminar datos
        /* await Promise.all([
            Categoria.destroy({where:{}, truncate:true}),
            Precio.destroy({where:{}, truncate:true})
        ]); */

        //tambien elimina datos de la bd, pero de una forma mas corta
        await db.sync({force:true});
        console.log('Datos eliminado con éxito');
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === '-i'){
    importarDatos();
}

if(process.argv[2] === '-e'){
    eliminarDatos();
}