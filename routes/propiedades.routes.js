import express  from "express";
import {body} from 'express-validator';
import protegerRuta from '../middlewares/protegerRuta.js';
import {admin, crear, guardar} from '../controllers/propiedades.controller.js';

const router = express.Router();

router.get('/mis-propiedades', protegerRuta, admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
                        body('tituloProp').notEmpty().withMessage('El título no puede quedar vacío'),
                        body('descripcion').notEmpty().withMessage('La descripción no puede quedar vacío')
                        .isLength({max: 100}).withMessage('El descripción es muy larga'),
                        body('categoria').isNumeric().withMessage('Selecciona una categoría'),
                        body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
                        body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
                        body('wc').isNumeric().withMessage('Selecciona cantidad de baños'),
                        body('lat').isNumeric().withMessage('Ubica la propiedad en el mapa'),
                        guardar);


export default router;