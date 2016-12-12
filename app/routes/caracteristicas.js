const express = require('express');

// Criação do server express
const app = express();

// ----------------------------------------------- Rotas de Características ----------------------------------------------

var controleCaracteristicas = require('../modulos/caracteristica/controller.js');

app.post('/cadastro', function(req,res){
  controleCaracteristicas.cadastrar(req,res);
});

app.get('/listar' , controleCaracteristicas.listar);

app.get('/listar/:id' , controleCaracteristicas.findById);

app.get('/listar/posicao/:posicao' , controleCaracteristicas.findByPosicao);

app.get('/listar/nome/:nome' , controleCaracteristicas.findByNome);

app.get('/delete/:id', controleCaracteristicas.deletarRegistro);

app.put('/update/:id', controleCaracteristicas.atualizarRegistro);

// ----------------------------------------------- Rotas de Características ----------------------------------------------

module.exports = app;
