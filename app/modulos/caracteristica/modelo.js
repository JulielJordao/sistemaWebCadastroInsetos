var moongose = require('mongoose');
var Schema = moongose.Schema;

var caracteristicaSchema = new Schema({
    nome : {
      type : String,
      required : true
    },
    imagem : {
      type : String,
      require : true
    }
});

var caracteristica = moongose.model('caracteristica', caracteristicaSchema);

module.exports = caracteristica;
