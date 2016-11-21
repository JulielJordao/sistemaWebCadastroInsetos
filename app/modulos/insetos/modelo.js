var moongose = require('mongoose');
var Schema = moongose.Schema;

var caracteristicaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        require: true
    },
    _id: {
        type: String,
        require: true
    }
});

var ordemShema = new Schema({
  nome : {
      type: String,
      required: true
  },
  _id : {
      type: String,
      required: true
  }
});

var insetoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        required: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    posicao: {
      type: Number
    },
    caracteristicas: [caracteristicaSchema],
    ordem: [ordemShema]
});

var Inseto = moongose.model('inseto', insetoSchema);

module.exports = Inseto;
