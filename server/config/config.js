//========================
//Puerto
//===========================
process.env.PORT = process.env.PORT || 3000;

//========================
//Environment
//===========================
//si no existe la variable da por hecho que nos encontramos en el entorno de desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//========================
//BASE DE DATOS
//===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    //URL MONGODB LOCALHOST 
    urlDB = 'mongodb://localhost:27017/super-cafe';
} else {
    //URL MONGODB ATLAS
    //urlDB = 'mongodb+srv://beeter:beeter@cluster0.slizp.mongodb.net/super-cafe';
    //Modificamos la url para que no puedan ver las credenciales mediante una variable de 
    //entorno en HEROKU 
    urlDB = process.env.MONGODB_URI;
}

//VARIABLE PARA ALMACENAR URL

process.env.URLDB = urlDB;