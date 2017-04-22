var Familia = require('./modelo');

var cadastrar = function(inseto, salvo, error) {
    new Familia(inseto).save(function(err, resultados) {
        if (err) {
            error(err)
        } else {
            salvo(resultados);
        }
    });
};

exports.cadastrar = cadastrar;

var listar = function(quandoEncontrar, quandoDerErro) {
    Familia.find().select().exec(function(err, ordem) {
        if (err) {
            quandoDerErro(err)
        } else {
            quandoEncontrar(ordem)
        }
    });
};

exports.listar = listar;

var findByNome = function(nome, quandoEncontrar, quandoDerErro) {
    Familia.find({
        nome: nome
    }).exec(function(err, valor) {
        if (err) {
            quandoDerErro(err);
        } else if (valor) {
            quandoEncontrar(valor);
        }
    });
};

exports.findByNome = findByNome;

var findById = function(id, quandoEncontrar, quandoDerErro) {
    Familia.findOne({
        _id: id
    }).exec(function(err, valor) {
        if (err) {
            quandoDerErro(err);
        } else if (valor) {
            quandoEncontrar(valor);
        }
    });
};

exports.findById = findById;

var deletarRegistro = function(codigo, quandoEncontrar, quandoDerErro) {
    Familia.findOne({
        _id: codigo
    }).remove().exec(function(err, ordem) {
        if (err) {
            quandoDerErro(err)
        } else {
            quandoEncontrar(ordem)
        }
    });
};

exports.deletarRegistro = deletarRegistro;

var atualizarRegistro = function(codigo, entity, quandoEncontrar, quandoDerErro){
    Familia.findByIdAndUpdate(codigo, entity).exec(function(err, ordem){
    if(err){
      quandoDerErro(err)
    } else {
      quandoEncontrar(ordem)
    }
  });
};

exports.atualizarRegistro = atualizarRegistro;
