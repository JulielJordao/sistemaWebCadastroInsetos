var Usuario = require('./modelo');

var cadastrar = function(usuario, salvo, error){
    new Usuario(usuario).save(function(err, resultados){
      if(err){
        error(err)
      } else {
        salvo(resultados);
      }
    });
};

exports.cadastrar = cadastrar;

var listar = function(quandoEncontrar, quandoDerErro){
    Usuario.find().select({_id : true, nome : true, login: true, email: true}).exec(function(err, usuarios){
    if(err){
      quandoDerErro(err)
    } else {
      quandoEncontrar(usuarios)
    }
  });
};

exports.listar = listar;

var autenticar = function(login, senha, quandoEncontrar, quandoDerErro){
  Usuario.findOne({login:login, senha:senha}).exec(function(err,usuario){
    if(err){
      quandoDerErro(err);
    } else if(usuario){
      quandoEncontrar(usuario);
    } else {
      quandoDerErro(new Error('Usuário Inválido!'));
    };
  });
};

exports.autenticar = autenticar;
