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

var familiaSchema = new Schema({
  nome : {
    type : String,
    required : true
  },
  insetoReferencia : {
    type : String,
    require : true
  },
  imagem : {
    type : String,
    require : true
  },
  dataCadastro: {
      type: Date,
      default: Date.now
  },
  caracteristicas : [caracteristicaSchema]
});

var Familia = moongose.model('ordem', familiaSchema);

module.exports = Ordem;
