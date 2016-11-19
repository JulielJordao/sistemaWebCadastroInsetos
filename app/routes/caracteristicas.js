const express = require('express');

// Criação do server express
const app = express();

// ----------------------------------------------- Rotas de Características ----------------------------------------------

var controleCaracteristicas = require('../modulos/caracteristica/controller.js');

app.post('/cadastro', function(req,res){
  controleCaracteristicas.cadastrar(req,res);
});

app.get('/listar' , controleCaracteristicas.listar);

// ----------------------------------------------- Rotas de Características ----------------------------------------------

module.exports = app;
