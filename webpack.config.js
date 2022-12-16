import path from 'path';

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        dropzone:'./src/js/agregar-imagen.js'
    },
    output: {
        filename : '[name].js',
        path: path.resolve('public/js')
    }
}