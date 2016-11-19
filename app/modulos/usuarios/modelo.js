const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    login: {
      type: String,
      required: true
    },
    senha: {
      type: String,
      required: true
    }
})

// console.log(usuarioSchema)
var Usuario = mongoose.model('usuario', usuarioSchema);

module.exports = Usuario;
