//Archivo auxiliar que define las relaciones

import Categoria from './categorias.js';
import Precio from './precios.js';
import Propiedad from './propiedades.js';
import Usuario from './Usuario.js';

//crea la relacion uno a uno
//ver: se lee de derecha a izquierda, Propiedad tiene un precio
//Precio.hasOne(Propiedad);


//otra forma de relacionar una relacion uno a uno, 
//ver: esta forma es mas natural, se lee de izquierda a derecha, o sea Propiedad tiene un precio
Propiedad.belongsTo(Precio, {foreignKey:'id_precio'});
Propiedad.belongsTo(Categoria, {foreignKey: 'id_categoria'})
Propiedad.belongsTo(Usuario, {foreignKey:'id_usuario'});
export {
    Categoria,
    Precio,
    Propiedad,
    Usuario
}