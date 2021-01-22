const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { find } = require('underscore');
// const usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    //los parametros opcionales caen  en el query
    // desde indica que viene un paramtro, si no comienza desde el 0
    let desde = req.query.desde || 0;
    desde = Number(desde);

    //indica el numero de registros por pagina que se  recuperaran, si no se indica, regresara de 5 en 5 los registros.
    let limite = req.query.limite || 5;
    limite = Number(limite);
    //find recibe restricciones para filtrar resultados
    // ejemplo: Usuario.find({ google: true})
    // Para filtrar los campos que solo sean necesarios, la funcion find() 
    // recibe un segundo argumento en forma de string con los campos unicmanete necesarios.
    // Ejemplo: Usuario.find({google:true}, 'nombre email role estado google img ')
    Usuario.find({ estado: true }, 'nombre email role estado google img ')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });

            //funcion .conunt() cuenta el numero de registros en la busqueda.
            //Recibe como parametro un callback que regresa el array json con los datos
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err)
                    return res.status(400).json({
                        ok: false,
                        err
                    });

                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios
                });

            });



        });

});

app.post('/usuario', function(req, res) {
    //body almacena los datos que tiene el body de la solicitud.
    let body = req.body;
    //se crea una instacia del Schema Usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //hacemos el hash de forma sincrona, (campo, numero de vueltas)
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        //save guarda en base de datos, como parametro tiene un callback para controlar errores.
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    //obtener los parametros ingresados en la url 
    let id = req.params.id;
    //utilizamos underscore llamando a la funcion pick, que recibira 
    //el objeto que tiene todas las propiedades y  un array con las propiedades validas
    //las que se pueden actualizar.
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // EL TERCER PARAMETRO: new: regresa el documento nuevo ya modificafo
    //                      runValidators: ejecuta las validaciones definidas en el schema 
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let cambiEstado = {
        estado: false
    };

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiEstado, { new: true }, (err, usuarioBorrado) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: 'El usuario no se encontro...'
            });
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});

module.exports = app;