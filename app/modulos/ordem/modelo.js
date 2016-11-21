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

var ordemSchema = new Schema({
  nome : {
    type : String,
    required : true
  },
  insetoReferencia : {
    type : String,
    require : true
  },
  caracteristicas : [caracteristicaSchema]
});

var Ordem = moongose.model('ordem', ordemSchema);

module.exports = Ordem;
