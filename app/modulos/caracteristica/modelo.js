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
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
        require : true
    },
    posicao: {
      type : Number
    }
});

var caracteristica = moongose.model('caracteristica', caracteristicaSchema);

module.exports = caracteristica;
