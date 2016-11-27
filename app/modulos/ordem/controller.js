var Ordem = require('./ordem');

var cadastrar = function(req, res) {
    var ordem = req.body;

    if (req.session.user !== undefined) {
        Ordem.cadastrar(ordem, sucesso, error);
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
    Ordem.listar(sucesso, error);

    function sucesso(resultado) {
        res.status(201).json(resultado);
    }

    function error(err) {
        res.status(400).json(err);
    }
};

exports.listar = listar;

var findByNome = function(req, res) {
    Ordem.findByNome(req.body.nome, sucesso, error);

    function sucesso(resposta) {
        res.status(200).json(resposta);
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.findByNome = findByNome;

var findById = function(req, res) {
    Ordem.findById(req.params.id, sucesso, error);

    function sucesso(resposta) {
        res.status(200).json(resposta);
        // res.status(200).json({nome : resposta.nome, imagem : resposta.imagem});
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.findById = findById;


var deletarRegistro = function(req, res) {
    if (req.session.user !== undefined) {
        Ordem.deletarRegistro(req.params.id, sucesso, error);
    } else {
        res.json({
            error: 'Usuário não logado'
        })
    }

    function sucesso(resposta) {
        res.status(200).json(resposta);
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.deletarRegistro = deletarRegistro;

var atualizarRegistro = function(req, res) {
    var entity = req.body;
    if (req.session.user !== undefined) {
        Ordem.atualizarRegistro(req.params.id, entity, sucesso, error);
    } else {
        res.json({
            error: 'Usuário não logado'
        })
    }

    function sucesso(resposta) {
        res.status(200).json(resposta);
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.atualizarRegistro = atualizarRegistro;
