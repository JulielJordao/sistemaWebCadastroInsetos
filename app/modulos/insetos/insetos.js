var Insetos = require('./modelo');

var cadastrar = function(inseto, salvo, error) {
    new Insetos(inseto).save(function(err, resultados) {
        if (err) {
            error(err)
        } else {
            salvo(resultados);
        }
    });
};

exports.cadastrar = cadastrar;

var listar = function(quandoEncontrar, quandoDerErro) {
    Insetos.find().select().exec(function(err, insetos) {
        if (err) {
            quandoDerErro(err)
        } else {
            quandoEncontrar(insetos)
        }
    });
};

exports.listar = listar;

var findByNome = function(nome, quandoEncontrar, quandoDerErro) {
    Insetos.findOne({
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
    Insetos.findOne({
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
    Insetos.findOne({
        _id: codigo
    }).remove().exec(function(err, insetos) {
        if (err) {
            quandoDerErro(err)
        } else {
            quandoEncontrar(insetos)
        }
    });
};

exports.deletarRegistro = deletarRegistro;
