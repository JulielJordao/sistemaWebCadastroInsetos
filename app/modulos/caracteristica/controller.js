
var caracteristicas = require('./caracteristicas');

var cadastrar = function(req, res){
    var caracteristica = req.body;

    caracteristicas.cadastrar(caracteristica, sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.cadastrar = cadastrar;

var listar = function(req, res){
    caracteristicas.listar(sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.listar = listar;

var findByNome = function(req, res){
    caracteristicas.findByNome(req.body.nome, sucesso, error);

    function sucesso(resposta){
      res.status(200).json({nome : resposta.nome, imagem : resposta.imagem});
    };

    function error(err){
      res.status(400).json(err);
    };
};

exports.findByNome = findByNome;

var deletarRegistro = function(codigo, quandoEncontrar, quandoDerErro){
    caracteristicas.findOne({_id : codigo}).remove().exec(function(err, caracteristica){
    if(err){
      quandoDerErro(err)
    } else {
      quandoEncontrar(caracteristica)
    }
  });
};

exports.deletarRegistro = deletarRegistro;
