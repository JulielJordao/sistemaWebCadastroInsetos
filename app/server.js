// Instanciando os módulos Express e Mongoose

const express = require('express');

// Criação do server express
const app = express();

// Acesso ao banco de dados mongodb
const mongoose = require('mongoose');

// Envio de arquivos
const multer  = require('multer');

// Criar um corpo na requição, métodos do tipo post no app
const bodyParser = require('body-parser');

// Função de cryptograr
const crypto = require('crypto');

// Mapeamento de endereços e arquivos
const path = require('path')

// abertura de session
const session = require('express-session');

//
var parseurl = require('parseurl')

var rotasUsuario = require('./routes/users');

var rotasCaracteristicas = require('./routes/caracteristicas');

var rotasInsetos = require('./routes/insetos')

var rotasOrdem = require('./routes/ordem')

app.use(session({
    resave: false, //não salve a sessão se ela não for modificada
    saveUninitialized: false, //não crie sessão até alguma informação ser armazenada
    name : "COOKIE_NAME",
    secret: "COOKIE_PASS",
    // store : sessionStore,
    cookie : {maxAge : (60000 * 24 * 30)}
}));

var logado = false;
var usuario = null;

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) { // Criptografia dos dados
      if (err) return cb(err)
      // Salvo com o nome original
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

var upload = multer({ storage: storage });

mongoose.connect('mongodb://teste:teste@ds017165.mlab.com:17165/sistema_faculdade');
// mongoose.connect('mongodb://localhost:27017');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use('/api/users/', rotasUsuario);

app.use('/api/caracteristicas', rotasCaracteristicas);

app.use('/api/insetos', rotasInsetos);

app.use('/api/ordem', rotasOrdem);

// Configura as rotas da tela
app.get('/', function(req, res) {
    // res.send('Hello World!');
    res.redirect('login.html');
});

app.post('/api/uploads', upload.single('image'), function(req,res){
    res.json({ code: req.file.filename })
});

app.listen(app.get('port'), function(){
  console.log("Express iniciou em localhost:3000");
});
