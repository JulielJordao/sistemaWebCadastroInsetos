const express = require('express');

const app = express();

//
var Usuario = require('../modulos/usuarios/modelo');

const controleUsuario = require('../modulos/usuarios/controller')

// ----------------------------------------------- Rotas de Login ----------------------------------------------

app.post('/login', function(req,res) {
  // controleUsuario.autenticar(req,res);
  Usuario.findOne({login:req.body.login, senha : req.body.senha}).exec(function(err,usuario){
    if(err){
      res.json(err);
    } else if(usuario){
      abrirSessao({nome : usuario.nome, login : usuario.login});
      res.json({nome : usuario.nome, login : usuario.login});

    } else {
      res.json({});
    };
  });

  function abrirSessao(teste){
    req.session.user = teste.nome;
    req.session.isLogged = true;
  };
});

app.get('/listar' , controleUsuario.listar);

app.post('/cadastrar' , controleUsuario.cadastrar);

app.get('/obterSessao', function(req,res){
  if(req.session.user !== undefined){
    res.json(req.session);
  } else {
    res.json({error : 'Usuário não logado'})
  }
});

app.get('/logout', function(req, res){
  req.session.destroy();
  res.json({logado : false});
});

// ----------------------------------------------- Rotas de Login ----------------------------------------------

module.exports = app;
