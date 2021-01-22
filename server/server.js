/**
 * Al sser el primer archivo que se ejecuta al iniciar la app 
 * configurara lo que el archivo contenga ya sea produccion o desarollo
 */
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//importamos y usamos el archivo usuario 
app.use(require('./routes/usuario'));


//Creamos coneccion con mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err;

    console.log(`Base de Datos ONLINE....`);
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando desde el puerto: ", 3000);
});