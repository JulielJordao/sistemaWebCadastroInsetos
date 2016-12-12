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
//
var ordem = new Schema({
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
    caracteristicas: [caracteristicaSchema],
    ordem: {
      type : ordem,
      required : true
    }

});

var Inseto = moongose.model('inseto', insetoSchema);

module.exports = Inseto;
