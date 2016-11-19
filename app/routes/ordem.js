const express = require('express');

// Criação do server express
const app = express();

// ----------------------------------------------- Rotas de Ordem ----------------------------------------------

var controleOrdem = require('../modulos/ordem/controller.js');

app.post('/cadastro', function(req,res){
  controleOrdem.cadastrar(req,res);
});

app.get('/listar' , controleOrdem.listar);

// ----------------------------------------------- Rotas de Ordem ----------------------------------------------

module.exports = app;
