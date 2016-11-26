const express = require('express');

// Criação do variavel express
const app = express();

// ----------------------------------------------- Rotas de Características ----------------------------------------------

var controleInsetos = require('../modulos/insetos/controller.js');

app.post('/cadastro', function(req,res){
  controleInsetos.cadastrar(req,res);
});

app.get('/listar' , controleInsetos.listar);

app.get('/listar/nome/:nome', controleInsetos.findByNome);

app.get('/listar/:id' , controleInsetos.findById);

app.get('/delete/:id', controleInsetos.deletarRegistro);

// ----------------------------------------------- Rotas de Características ----------------------------------------------

module.exports = app;
