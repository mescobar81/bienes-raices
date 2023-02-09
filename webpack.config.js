import path from 'path';

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        dropzone:'./src/js/agregar-imagen.js',
        mostrarMapa: './src/js/mostrarMapa.js'
    },
    output: {
        filename : '[name].js',
        path: path.resolve('public/js')
    }
}