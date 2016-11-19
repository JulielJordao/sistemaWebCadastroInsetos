var moongose = require('mongoose');
var Schema = moongose.Schema;

var ordemSchema = new Schema({
  nome : {
    type : String,
    required : true
  },
  insetoReferencia : {
    type : String,
    require : true
  }
});

var Ordem = moongose.model('ordem', ordemSchema);

module.exports = Ordem;
