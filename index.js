
//const express = require('express'); // --> CommonJs, forma de importar antiguo

import express from 'express'; // ECMAScript, nueva forma de importar librerias
import usuarioRoutes from './routes/usuario.routes.js';

const app = express();

//configurar pug
app.set('view engine', 'pug');
app.set('views', './views');

//configuramos la carpeta de acceso public para archivos estaticos
app.use(express.static('public'));

//routing
app.use('/bienes-raices/auth', usuarioRoutes);

const PORT = 3000;

app.listen(PORT, () =>{
    console.log('Servidor escuchando en el puerto ', PORT);
});