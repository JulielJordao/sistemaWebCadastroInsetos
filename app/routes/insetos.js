const express = require('express');

// Criação do variavel express
const app = express();

// ----------------------------------------------- Rotas de Características ----------------------------------------------

var controleInsetos = require('../modulos/insetos/controller.js');

app.post('/cadastro', function(req,res){
  controleInsetos.cadastrar(req,res);
});

app.get('/listar' , controleInsetos.listar);

// ----------------------------------------------- Rotas de Características ----------------------------------------------

module.exports = app;
