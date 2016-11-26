var usuarios = require('./usuario');

var cadastrar = function(req, res) {

    var usuario = req.body;

    if (req.session.user !== undefined) {
        usuarios.cadastrar(usuario, sucesso, error);
    } else {
        res.json({
            error: 'Usuário não logado'
        })
    }

    function sucesso(resultado) {
        res.status(201).json(resultado);
    }

    function error(err) {
        res.status(400).json(err);
    }
};

exports.cadastrar = cadastrar;

var listar = function(req, res) {

    if (req.session.user !== undefined) {
        usuarios.listar(sucesso, error);
    } else {
        res.json({
            error: 'Usuário não logado'
        })
    }

    function sucesso(resultado) {
        res.status(201).json(resultado);
    }

    function error(err) {
        res.status(400).json(err);
    }
};

exports.listar = listar;

var autenticar = function(req, res) {

    usuarios.autenticar(req.body.login, req.body.senha, sucesso, error);

    function sucesso(resposta) {
        res.status(200).json({
            login: resposta.login,
            nome: resposta.nome
        });
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.autenticar = autenticar;

var deletarUsuario = function(req, res) {

    if (req.session.user !== undefined) {
        usuarios.delete(req.body.login, req.body.senha, sucesso, error);
    } else {
        res.json({
            error: 'Usuário não logado'
        })
    }


    function sucesso(resposta) {
        res.status(200).json("Sucesso");
        // return {login : resposta.login};
    };

    function error(err) {
        res.status(400).json(err);
        // return err;
    };
};

var testarUsuario = function(req, res) {

    usuarios.autenticar(req.body.login, req.body.senha, sucesso, error);

    function sucesso(resposta) {
        return resposta;
    };

    function error(err) {
        return err;
    };
};

exports.testarUsuario = testarUsuario;
