
const portegerRuta = (req, res, next) =>{
    console.log('Desde Middleware');
    next();
}

export default portegerRuta;