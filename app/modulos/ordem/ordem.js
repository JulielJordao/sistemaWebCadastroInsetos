var Ordem = require('./modelo');

var cadastrar = function(inseto, salvo, error) {
    new Ordem(inseto).save(function(err, resultados) {
        if (err) {
            error(err)
        } else {
            salvo(resultados);
        }
    });
};

exports.cadastrar = cadastrar;

var listar = function(quandoEncontrar, quandoDerErro) {
    Ordem.find().select().exec(function(err, ordem) {
        if (err) {
            quandoDerErro(err)
        } else {
            quandoEncontrar(ordem)
        }
    });
};

exports.listar = listar;

var findByNome = function(nome, quandoEncontrar, quandoDerErro) {
    Ordem.findOne({
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
    Ordem.findOne({
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
    Ordem.findOne({
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
