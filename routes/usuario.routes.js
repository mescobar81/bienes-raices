import express from 'express';
import { login, registro, registrar, restaurarPassword, confirmar } from '../controllers/usuario.controller.js';

const router = express.Router();

router.get('/login', login); //ver: login --> representa el controlador
router.get('/registro', registro);
router.get('/restaurar-password', restaurarPassword);
router.post('/registrar', registrar);
router.get('/confirmar/:token', confirmar);

router.post('/contacto', (req, res) =>{
    res.json({mensaje:'Estas en la página de contacto'});
});


export default router;