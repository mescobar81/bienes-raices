import express from 'express';
import { login, registro, registrar, restaurarPassword, 
    confirmar, 
    resetPassword, 
    comprobarToken, 
    nuevoPassword, 
    autenticar} from '../controllers/usuario.controller.js';

const router = express.Router();

router.get('/login', login); //ver: login --> representa el controlador
router.post('/login', autenticar);

router.get('/registro', registro);
router.get('/restaurar-password', restaurarPassword);
router.post('/restaurar-password', resetPassword);

router.post('/registrar', registrar);
router.get('/confirmar/:token', confirmar);

router.get('/restaurar-password/:token', comprobarToken);
router.post('/restaurar-password/:token', nuevoPassword);

router.post('/contacto', (req, res) =>{
    res.json({mensaje:'Estas en la página de contacto'});
});


export default router;