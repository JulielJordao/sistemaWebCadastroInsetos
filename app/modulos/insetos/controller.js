
var Insetos = require('./insetos');

var cadastrar = function(req, res){
    var insetos = req.body;

    Insetos.cadastrar(insetos, sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.cadastrar = cadastrar;

var listar = function(req, res){
    Insetos.listar(sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.listar = listar;

var findByNome = function(req, res){
    Insetos.findByNome(req.params.nome, sucesso, error);

    function sucesso(resposta){
      res.status(200).json(resposta);
      // res.status(200).json({nome : resposta.nome, imagem : resposta.imagem});
    };

    function error(err){
      res.status(400).json(err);
    };
};

exports.findByNome = findByNome;


var deletarRegistro = function(req, res){
  
    console.log(req.params.id);

    Insetos.deletarRegistro(req.params.id, sucesso, error);

    function sucesso(resposta){
      res.status(200).json(resposta);
    };

    function error(err){
      res.status(400).json(err);
    };
};

exports.deletarRegistro = deletarRegistro;
