import express  from "express";
import {body} from 'express-validator';
import {admin, crear, guardar} from '../controllers/propiedades.controller.js';

const router = express.Router();

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear',
                        guardar);


export default router;