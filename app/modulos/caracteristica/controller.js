var caracteristicas = require('./caracteristicas');

var cadastrar = function(req, res) {
    var caracteristica = req.body;

    if (req.session.user !== undefined) {
        caracteristicas.cadastrar(caracteristica, sucesso, error);
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
    caracteristicas.listar(sucesso, error);

    function sucesso(resultado) {
        res.status(201).json(resultado);
    }

    function error(err) {
        res.status(400).json(err);
    }
};

exports.listar = listar;

var findByNome = function(req, res) {
    caracteristicas.findByNome(req.params.nome, sucesso, error);

    function sucesso(resposta) {
        res.status(200).json(resposta);
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.findByNome = findByNome;

var findById = function(req, res) {
    caracteristicas.findById(req.params.id, sucesso, error);

    function sucesso(resposta) {
        res.status(200).json(resposta);
    };

    function error(err) {
        res.status(400).json(err);
    };
};

exports.findById = findById;

var deletarRegistro = function(req, res) {

    if (req.session.user !== undefined) {
        caracteristicas.deletarRegistro(req.params.id, sucesso, error);
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
        caracteristicas.atualizarRegistro(req.params.id, entity, sucesso, error);
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
