var Insetos = require('./modelo');

var cadastrar = function(inseto, salvo, error){
    new Insetos(inseto).save(function(err, resultados){
      if(err){
        error(err)
      } else {
        salvo(resultados);
      }
    });
};

exports.cadastrar = cadastrar;

var listar = function(quandoEncontrar, quandoDerErro){
    Insetos.find().select({_id : true, nome : true, imagem: true}).exec(function(err, caracteristica){
    if(err){
      quandoDerErro(err)
    } else {
      quandoEncontrar(caracteristica)
    }
  });
};

exports.listar = listar;

var findByNome = function(nome, quandoEncontrar, quandoDerErro){
  Insetos.findOne({nome : nome}).exec(function(err, valor){
    if(err){
      quandoDerErro(err);
    } else if(valor){
      quandoEncontrar(valor);
    }
  });
};

exports.findByNome = findByNome;
