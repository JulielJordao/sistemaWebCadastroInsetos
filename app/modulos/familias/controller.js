var Familia = require('./familia');

var cadastrar = function(req, res) {
    var familia = req.body;

    if (req.session.user !== undefined) {
        Familia.cadastrar(familia, sucesso, error);
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
    Familia.listar(sucesso, error);

    function sucesso(resultado) {
        res.status(201).json(resultado);
    }

    function error(err) {
        res.status(400).json(err);
    }
};

exports.listar = listar;

var findByNome = function(req, res) {
    // console.log(req.params.nome);
    Familia.findByNome(req.params.nome, sucesso, error);

    function sucesso(resposta) {
        console.log(resposta);
        res.status(200).json(resposta);
        // res.status(200).json({nome : resposta.nome, imagem : resposta.imagem});
    };

    function error(err) {
        console.log(err);
        res.status(400).json(err);
    };
};

exports.findByNome = findByNome;

var findById = function(req, res) {
    Familia.findById(req.params.id, sucesso, error);

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
        Familia.deletarRegistro(req.params.id, sucesso, error);
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
        Familia.atualizarRegistro(req.params.id, entity, sucesso, error);
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
