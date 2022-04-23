const mongoose = require('mongoose');

let SchemaUsuario = mongoose.Schema({
    strNombre: {
        type: String,
        required:[true,'No se recibio el strNombre favor de ingresarlo']
    },
    strApellido:{
        type: String,
        required:[true,'No se recibio el strApellido favor de ingresarlo']
    },
    strDireccion:{
        type: String,
        required:[true,'No se recibio el strDireccion favor de ingresarlo']
    },
    strEmail:{
        type: String,
        required:[true,'No se recibio el strEmail favor de ingresarlo']
    },
    strContrasena:{
        type: String,
        required:[true,'No se recibio el strContrasena favor de ingresarlo']
    }

})

module.exports = mongoose.model('usuario',SchemaUsuario);