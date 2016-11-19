
var Ordem = require('./ordem');

var cadastrar = function(req, res){
    var ordem = req.body;

    Ordem.cadastrar(ordem, sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.cadastrar = cadastrar;

var listar = function(req, res){
    Ordem.listar(sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.listar = listar;

var findByNome = function(req, res){
    Ordem.findByNome(req.body.nome, sucesso, error);

    function sucesso(resposta){
      res.status(200).json(resposta);
    };

    function error(err){
      res.status(400).json(err);
    };
};

exports.findByNome = findByNome;
