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
        };

        function sucesso(res) {

            if (res.data.nome === undefined) {
                Notification.error({
                    message: "Login ou senha incorretos",
                    title: 'Acesso'
                })
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
        setTimeout(function() {
            if ($rootScope.logado === undefined) {
                Notification.error({
                    message: "Não possui permissão de acesso, favor logar! Redirecionado login ... ",
                    title: "Controle de Acesso"
                });
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
            quantSuccess = 0
        imagem = null;


        if (config.entity.length !== undefined) {
            testaArray = true;
        }

        if (testaArray === false) {
            if (config.entity.imagem !== undefined && config.entity.imagem !== null && config.entity.imagem !== "") {
                imagem = config.entity.imagem;
            };
            $http.get(config.route + "/delete/" + config.entity._id).then(result, error);
        } else {
            for (x in config.entity) {
                if (config.entity[x].selecionado === true) {
                    if (config.entity.imagem !== undefined && config.entity.imagem !== null && config.entity.imagem !== "") {
                        imagem = config.entity[x].imagem;
                    };
                    $http.get(config.route + "/delete/" + config.entity[x]._id).then(result, error);
                }
            }
        }

        function result(res) {
            deletarImagem(imagem);
            quantSuccess++;
        };

        function error(err) {
            quantError++;
        };

        setTimeout(function() {
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

    function deletarImagem(imagem) {
        $http.get("/api/deleteImage/" + imagem).then(sucesso, error)

        function sucesso(res) {

        };

        function error(err) {

        };
    };

    function obterCopia(config, callback) {

        $http.get(config.route + "/listar/nome/" + config.entity.nome).then(result, err);

        function result(res) {
            callback(res.data);
        };

        function err(err) {
            callback(err);
        };

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

        $http.get(route + "/listar/" + id).then(sucesso, error);

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
        var temp = [];

        temp = obterCopia(cadastro, obter);

        function obter(res) {
            temp = res;

            if (temp[0] !== undefined) {
                Notification.error({
                    message: "Já existe um registro cadastrado!",
                    title: cadastro.title
                });
            } else {
                executaRequisicao();
            }
        };

        function executaRequisicao() {

            $http.post(cadastro.route + "/cadastro", cadastro.entity).then(result, error)

            function result(res) {
                Notification.success({
                    message: "Cadastro com Sucesso!",
                    title: cadastro.title
                });

                cadastro.entity = {};

                setTimeout(function() {
                    window.location.href = "/index.html#!/gerenciar" + cadastro.title;
                }, 2000);

            };

            function error(err) {
                Notification.error({
                    message: "Ocorreu um erro inesperado!",
                    title: cadastro.title
                });
            };
        };
    };

    this.obterElementoPosicao = function(posicao, callback) {
        $http.get('api/caracteristicas/listar/posicao/' + posicao).then(result, error);

        function result(res){
          callback(res.data);
        };

        function error(err){
          console.log("Erro ao recuperar posição para pesquisa")
        };

    };

    this.atualizarRegistro = function(atualizar) {

        var temp = [];

        obterCopia(atualizar, obter);

        function obter(res) {
            temp = res;
            if (temp[0] !== undefined) {
                if (atualizar.entity._id === temp[0]._id) {
                    executaRequisicao();
                } else {
                    Notification.error({
                        message: "Já existe um registro cadastrado!",
                        title: atualizar.title
                    });
                }
            } else {
                executaRequisicao();
            }
        }


        function executaRequisicao() {
            $http.put(atualizar.route + "/update/" + atualizar.entity._id, atualizar.entity).then(result, error)

            function result(res) {

                Notification.success({
                    message: "Registro atualizado com Sucesso!",
                    title: atualizar.title
                });

                atualizar.entity = {};

                setTimeout(function() {
                    window.location.href = "/index.html#!/gerenciar" + atualizar.title;
                }, 2000);

            };

            function error(err) {
                Notification.error({
                    message: "Ocorreu um erro inesperado!",
                    title: atualizar.title
                });
            };

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
        var posicao = this.calcularPosicaoArvore(valor)
        var posicaoGalho, galhoSuperior, temp = 0,
            y = 1,
            array = [];

        galhoSuperior = this.calcularTotalElementos(posicao + 1, valor);

        if (posicao > 1) {
            posicaoGalho = this.calcularPosicaoFolha(posicao, valor);
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

    // Encontra o valor que antecede a aquela ramificaçaõ
    this.calcularAntecessor = function(valor) {
      if(valor > 6){
        var posicao = this.calcularPosicaoArvore(valor);

        var posicaoFimGalhoAnterior = this.calcularTotalElementos(posicao);

        var qtdElementosAteValor = valor - posicaoFimGalhoAnterior;

        var posicaoFimGalhoAntecessoAntecessor = this.calcularTotalElementos(posicao-1);

        var valorSoma = parseInt(qtdElementosAteValor / 2);

        if(qtdElementosAteValor % 2  !== 0){
          valorSoma += 1;
        }

        var result = posicaoFimGalhoAntecessoAntecessor + valorSoma;

      } else {
        if(valor === 3 || valor === 4){
          var result = 1;
        } else if(valor === 5 || valor === 6){
          var result = 2
        } else if(valor < 3){
          var result = null;
        }
      }

      return result;
    };

    this.calcularPosicaoFolha = function(valor) { // Define a posicao do elemento no galho

        var posicao = this.calcularPosicaoArvore(valor);
        var folhasTotaisAntecessor,
            resultado;

        folhasTotaisAntecessor = this.calcularTotalElementos(posicao, valor);

        resultado = valor - folhasTotaisAntecessor;

        return resultado;
    };

    this.calcularTotalElementos = function(posicaoGalho, valor) { // Define quantidadoes de elementos anteriores a aquele galha
        var x = 1,
            res = 0,
            fatoracao = 2;
        // Caso a posicao no galho seja maior que 1 ele realiza o loop para encontrar a quantidade de elementos totais no galho
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

        // Se a posicao no falho for 1 ele retorna o valor 1
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
    this.calcularPosicaoArvore = function(posicao) {
        var pos = 1,
            x = 2,
            arvoreAnterior = 2,
            arvoreSucessor = 6;

        if (posicao > 2) {
            while (true) {
                pos++;

                // Compara a posicao do galho anterior, mais a posicao do galho superior se estiver entre eles a posicao foi encontrada
                if (posicao > arvoreAnterior && posicao <= arvoreSucessor) {
                    break;
                }

                // Valor a acrescentar na soma da quantidade de elementos anteriores ao galho
                x *= 2;

                arvoreAnterior += x

                arvoreSucessor = arvoreAnterior + (x * 2);
            };
        }

        return pos;
    }
});
