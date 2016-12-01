var app = angular.module('myApp');

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- Controle de Acesso --------------------------------------------

app.service('usuariosService', function($rootScope, $location, $timeout, Notification, $http) {
    /*Esta função faz o papel de validação que seria feito no backend */
    this.validaLogin = function(user) {
        //usuários fictícios que possam ser usados pela página e pra validar o login
        var cont = 0;
        var usuario = {};

        $http.post('/api/users/login', {
            login: user.username,
            senha: user.password
        }).then(sucesso, error);

        function error(err) {
            Notification.error({
                message: "Login ou senha incorretos",
                title: 'Acesso'
            });
            // ("Login ou senha incorreto");
        };

        function sucesso(res) {

            if (res.data.nome === undefined) {
                // growl.error("Login ou senha incorretos");debugger
                Notification.error({
                        message: "Login ou senha incorretos",
                        title: 'Acesso'
                    })
                    // growl.error("Não possui permissão de acesso, favor logar!", {title: "ERRO PERMISSÂO!" , positionY: 'center', positionX: 'center'});
                    // window.alert("Login ou senha incorreto");
            } else {
                Notification.success({
                    message: "Logado com sucesso. Redirecionando ...",
                    title: "Controle de Acesso"
                })
                setTimeout(function() {
                    window.location.href = "/";
                }, 2000);

            }
        };

    };

    this.logout = function() {
        $http.get('/api/users/logout').then(result, error);

        function result(res) {};

        function error(err) {};

        $rootScope.usuarioLogado = null;
        window.location.href = "/login.html";
    };

    this.verificarUsuario = function() {
        $http.get('/api/users/obterSessao').then(result, error);

        function result(res) {
            if (res.data.isLogged !== undefined) {
                $rootScope.logado = res.data.isLogged;
                $rootScope.user = res.data.user;
            };
        };

        function error(err) {
            Notification.error({
                message: "Ocorreu um erro ao verificar a sessão! Atualize a página!",
                title: 'Acesso'
            });
            rootScope.logado = null;
        };
    };

    this.testarPermissao = function() {
        setTimeout(function () {
          if ($rootScope.logado === undefined) {
              Notification.error({
                  message: "Não possui permissão de acesso, favor logar! Redirecionado login ... ",
                  title: "Controle de Acesso"
              });
              // window.location.href = "/login.html"
              $timeout(function() {
                  window.location.href = "/login.html"
              }, 2000);

          }
        }, 150);
    };

    this.init = function(view) {
        $rootScope.view = view;
    }
})

// Verificar automaticamente se o usuário está logado
app.run(function($rootScope, $location, $timeout, $http, usuariosService) {
    usuariosService.verificarUsuario();

    $rootScope.logout = function() {
        usuariosService.logout();
    };
})

// --------------------------------------------------- Controle de Acesso --------------------------------------------
// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- CRUD Tela gerencial -------------------------------------------
app.service('crudService', function($rootScope, $location, $timeout, Notification, $http) {

    /*
     *   title - variavel da tela gerencial
     *   route  - rota parcial do back-end
     *   entity - entidade ou array a ser deletada
     */

    this.deletarRegistro = function(config) {

        var testaArray = false,
            x,
            quantError = 0,
            quantSuccess = 0;

        if (config.entity.length !== undefined) {
            testaArray = true;
        }

        if (testaArray === false) {
            $http.get(config.route + "/delete/" + config.entity._id).then(result, error);
        } else {
            for (x in config.entity) {
              if(config.entity[x].selecionado === true){
                $http.get(config.route + "/delete/" + config.entity[x]._id).then(result, error);
              }
            }
        }

        function result(res) {
            quantSuccess++;
        };

        function error(err) {
            quantError++;
            console.log(err);
        };

        setTimeout(function () {
          if (quantError !== 0) {
              Notification.error({
                  title: config.title,
                  message: "Ocorreu um erro ao Deletar Registro!"
              })
          } else {
              if (quantSuccess === 1) {
                  Notification.success({
                      title: config.title,
                      message: "Registros deletado com sucesso!"
                  })
              } else {
                  var mensagem = "Registo deletados com sucesso : " + quantSuccess + "!";
                  Notification.success({
                      title: config.title,
                      message: mensagem
                  })
              }
          }
        }, 300);

    };

    this.listarRegistros = function(route, callback) {

        $http.get(route + "/listar").then(sucesso, error);

          function sucesso(res) {
              callback(res);
          }

          function error(err) {
              callback(err)
          }
    };

    /*
    * id para executar o findById, route para a rota e callback para função a ser executa ao sucesso
    */
    this.obterRegistro = function(route, id, callback) {

        $http.get(route + "/listar/"+ id).then(sucesso, error);

          function sucesso(res) {
              callback(res);
          }

          function error(err) {
              callback(err)
          }
    };


    /*
    * Title - titulo das mensagens, entity - entidade a ser cadastrado, route - rota de cadastro
    */

    this.cadastrarRegistro = function(cadastro) {

        $http.post(cadastro.route + "/cadastro", cadastro.entity).then(result, error)

        function result(res) {
          Notification.success({
              message: "Cadastro com Sucesso!",
              title: cadastro.title
          });

          cadastro.entity = {};

          setTimeout(function() {
              window.location.href = "/index.html#!/gerenciar"+atualizar.title;
          }, 2000);

        };

        function error(err) {
          Notification.error({
              message: "Ocorreu um erro inesperado!",
              title: cadastro.title
          });
        };
    };


    this.atualizarRegistro = function(atualizar) {

        $http.put(atualizar.route + "/update/"+ atualizar.entity._id, atualizar.entity).then(result, error)

        function result(res) {
          Notification.success({
              message: "Registro atualizado com Sucesso!",
              title: atualizar.title
          });

          atualizar.entity = {};

          setTimeout(function() {
              window.location.href = "/index.html#!/gerenciar"+atualizar.title;
          }, 2000);

        };

        function error(err) {
          Notification.error({
              message: "Ocorreu um erro inesperado!",
              title: atualizar.title
          });
        };
    };

});


// --------------------------------------------------- FIM CRUD Tela gerencial ---------------------------------------
// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- CRUD Tela gerencial -------------------------------------------
app.service('arvoreService', function($timeout) {

    /*
     * Retorna um array de dois elementos com os sucessores da árvore
     */
    this.calcularSucessores = function(valor) {
        var posicao = calcularPosicaoArvore(valor)
        var posicaoGalho, galhoSuperior, temp = 0,
            y = 1,
            array = [];

        galhoSuperior = calcularTotalElementos(posicao + 1, valor);

        if (posicao > 1) {
            posicaoGalho = calcularPosicaoFolha(posicao, valor);
        } else {
            posicaoGalho = valor;
        }

        for (var x = 1; x < posicaoGalho; x++) {
            y += 2;
        };

        temp = (galhoSuperior + y);

        array.push(temp);
        array.push(temp + 1);

        return array;
    };


    this.calcularPosicaoFolha = function(valor) { // Define a posicao do elemento no galho

        var posicao = calcularPosicaoArvore(valor);
        var folhasTotaisAntecessor,
            resultado;

        folhasTotaisAntecessor = calcularTotalElementos(posicao, valor);

        resultado = valor - folhasTotaisAntecessor;

        return resultado;
    };

    this.calcularTotalElementos = function(posicaoGalho, valor) { // Define quantidadoes de elementos anteriores aquele galha
        var x = 1,
            res = 0,
            fatoracao = 2;
        if (posicaoGalho > 1) {
            while (true) {
                if (x === posicaoGalho) {
                    break;
                };
                res += fatoracao;
                fatoracao *= 2;
                x++;
            };
        }

        if (posicaoGalho === 1) {
            res = valor;
            return valor;
        };

        if (posicaoGalho !== 1) {
            return res;
        }
    };

    /*
     * Encontra a ramificação onde fica o valor
     */
    this.calcularPosicaoArvore = function(valor) {
        var pos = 1,
            x = 2,
            arvoreAnterior = 2,
            arvoreSucessor = 6;

        if (posicao > 2) {
            while (true) {
                pos++;
                if (valor > arvoreAnterior && valor <= arvoreSucessor) {
                    break;
                }

                x *= 2;

                arvoreAnterior += x

                arvoreSucessor = arvoreAnterior + (x * 2);
            };
        }

        return pos;
    }
});
