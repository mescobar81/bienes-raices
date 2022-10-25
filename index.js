
//const express = require('express'); // --> CommonJs, forma de importar antiguo

import express from 'express'; // ECMAScript, nueva forma de importar librerias
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import usuarioRoutes from './routes/usuario.routes.js';
import db from './config/db.js';

const app = express();

app.use(express.urlencoded({extended:false}))

//habilita cookie-parser
app.use(cookieParser());

app.use(csurf({cookie:true}))

//conexion a bd
try {
    await db.authenticate();
    db.sync();//hace que se creen tablas si no existe
    console.log('Conexion exitosa a la base de datos');
} catch (error) {
    console.log(error);
}

//configurar pug
app.set('view engine', 'pug');
app.set('views', './views');

//configuramos la carpeta de acceso public para archivos estaticos
app.use(express.static('public'));

//routing
app.use('/bienes-raices/auth', usuarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log('Servidor escuchando en el puerto ', PORT);
});