
var usuarios = require('./usuario');

var cadastrar = function(req, res){
    var usuario = req.body;

    usuarios.cadastrar(usuario, sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.cadastrar = cadastrar;

var listar = function(req, res){
    usuarios.listar(sucesso, error);

    function sucesso(resultado){
      res.status(201).json(resultado);
    }

    function error(err){
      res.status(400).json(err);
    }
};

exports.listar = listar;

var autenticar = function(req, res){

    usuarios.autenticar(req.body.login, req.body.senha, sucesso, error);

    function sucesso(resposta){
      res.status(200).json({login : resposta.login, nome : resposta.nome});
    };

    function error(err){
      res.status(400).json(err);
    };
};

exports.autenticar = autenticar;

var deletarUsuario = function(req, res){
    usuarios.delete(req.body.login, req.body.senha, sucesso, error);

    function sucesso(resposta){
      res.status(200).json("Sucesso");
      // return {login : resposta.login};
    };

    function error(err){
      res.status(400).json(err);
      // return err;
    };
};

var testarUsuario = function(req, res){

    usuarios.autenticar(req.body.login, req.body.senha, sucesso, error);

    function sucesso(resposta){
      return resposta;
    };

    function error(err){
      return err;
    };
};

exports.testarUsuario = testarUsuario;
