const mongoose = require('mongoose');
//COnstante para validaciones.
const uniqueValidator = require('mongoose-unique-validator');

//Valores validos para rrole
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};



//Los modelos se definen a través de la interfaz de esquema.
//Creacion de interfaz schema para crear objetos de mongoose
let Schema = mongoose.Schema;

//definicion de Schema y los campos de la coleccion 
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'EL nombre es necesario.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'EL correo es necesario.']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//modificamos el JSON del schema para poder borrar el password
// y no dando informacion sensible al usuario creando metodos al schema 
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


//LE asignamos el plugin mongoose-unique-validator al schema para validaciones Unique
// Aplicar el complemento uniqueValidator a userSchema.
usuarioSchema.plugin(uniqueValidator, { message: ' El {PATH} debe de ser unico' });

//  Una vez que definimos un modelo a través
//  de mongoose.model ('ModelName', mySchema), 
//  podemos acceder a él a través de la misma función
module.exports = mongoose.model('Usuario', usuarioSchema);