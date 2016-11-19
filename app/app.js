(function() {
    'use strict';
    var app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

    /* Criaremos um controller geral, e aqui adicionaremos algumas configurações*/
    app.controller('pageController', function($scope, usuariosService) {
        $scope.logout = function() {
            usuariosService.logout();
        }
    })

    // --------------------------------------------------- Controle de Acesso --------------------------------------------

    app.service('usuariosService', function($rootScope, $location, $timeout, $http) {
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
                window.alert("Login ou senha incorreto");
            };

            function sucesso(res) {
              console.log(res)

                if(res.data.nome === undefined){
                  window.alert("Login ou senha incorreto");
                }else {
                  window.location.href = "/";
                }
            };

        };

        this.logout = function() {
            $http.get('/api/users/logout').then(result, error);

            function result(res) {
                console.log(res);
            };

            function error(err) {

            };

            $rootScope.usuarioLogado = null;
            $location.path('/home')
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
                console.log(err);
                console.log("Ocorreu um erro ao verificar a sessão");
            };
        };

        this.testarPermissao = function(){
          console.log($rootScope);
          if($rootScope.logado === undefined){
            console.log("teste")
            window.alert("Não possui permissão de acesso, favor logar!");
            window.location.href = "/login.html"
            $timeout(function () {
            }, 500);

          }
        };
    })

    app.controller('loginController', function($scope, usuariosService) {
        $scope.logar = function(user) {
            usuariosService.validaLogin(user);
        }
    })

    app.controller('inicialController', function($scope, usuariosService) {
      $scope.view = "inicial";
    })


    // Verificar automaticamente se o usuário está logaado
    app.run(function($rootScope, $location, $timeout, $http, usuariosService) {
        usuariosService.verificarUsuario();
    })



    // --------------------------------------------------- Controle de Acesso --------------------------------------------




    // --------------------------------------------------- Controle de Cadastros --------------------------------------------

    // Controle do cadastro de cadastroCaracteristicas
    app.controller('cadastroCaracteristica', function($scope, $rootScope, $http, usuariosService) {

        $scope.selecionado = false;
        $scope.view = "cadastro";

        // usuariosService.testarPermissao();

        $scope.logout = function(){
          usuariosService.logout();
        };

        $scope.submeterCadastro = function(file) {
            // $scope.url.image.filename = $scope.url.image.name;
            var file = $scope.url.image;

            var fd = new FormData();

            fd.append('image', file);

            $http.post('api/uploads', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(result, errorImagem);

            function result(res) {
                $http.post('api/caracteristicas/cadastro', {
                    nome: $scope.caracteristica.nomCaracteristica,
                    imagem: res.data.code
                }).then(sucesso, error);

                function sucesso(resultado) {
                    console.log(resultado);
                    window.alert("Cadastro com Sucesso")
                    $scope.caracteristica.nomCaracteristica = "";
                    $scope.url.image = undefined;
                    $scope.cadastroCaracteristicaForm.$pristine = true;
                };

                function error(err) {
                    console.log(err);
                }
            };

            function errorImagem(err) {
                console.log(err)
            }
        }

        $scope.removerArquivo = function() {
            $scope.files = [];
        };

    })

    app.controller('cadastroInsetos', function($scope, $rootScope, $http, $uibModal, usuariosService) {

        $scope.listCaracteristicas = [];
        $scope.resultadoPesquisa = [];
        $scope.insetos = {};
        $scope.insetos.ordem = {};
        $scope.insetos.caracteristicas = [];
        $scope.ordemCadastroVisivel = false;
        $scope.selecionado = false;
        $scope.view = "cadastro";

        // usuariosService.testarPermissao();

        carregarCaracteristicas();
        carregarOrdem();

        //  --------------------------------  Função de Salvar Imagem -----------------------------
        $scope.submeterCadastro = function(file) {
            // $scope.url.image.fshowModalilename = $scope.url.image.name;
            var file = $scope.url.image;

            var fd = new FormData();

            fd.append('image', file);

            $http.post('api/uploads', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(result, errorImagem);

            function result(res) {
                console.log(res.data);
                $scope.insetos.imagem = res.data.code;
                $http.post('api/insetos/cadastro', $scope.insetos).then(sucesso, error);

                function sucesso(resultado) {
                    console.log(resultado);
                    window.alert("Cadastro com Sucesso")
                };

                function error(err) {
                    console.log(err);
                }
            };

            function errorImagem(err) {
                console.log(err)
            };
        }

        $scope.removerLinhaCaracteristica = function(x){
          var x = 0, entity = $scope.insetos.caracteristicas;
          for(x in entity){
            if($scope.insetos.caracteristicas._id === x._id){
              console.log(x);
            }
          }
        };

        // --------------------- Função que carrega a lista de caracteristicas -----------------------

        function carregarCaracteristicas() {
            $http.get('api/caracteristicas/listar').then(sucesso, error);

            function sucesso(res) {
                $scope.caracteristicas = res.data;
                console.log(res.data);
            };

            function error(err) {
                console.log(res);
            };
        };

        // Remove todos os item inseridos na tabela da tela principal
        $scope.removerTudo = function() {
            $scope.ordem.caracteristicas = [];
        };

        $scope.removerArquivo = function() {
            $scope.files = [];
        };

        // Carrega qual vai ser a imagem a ser renderizada
        $scope.imagemModal = function() {
            // $scope.imagemCaracteristica = imagemExibir;
            var x = 0;
            // $timeout(function () {
            for (x in $scope.caracteristicas) {
                if ($scope.caracteristicas[x]._id === $scope.idSelectedCaracteristicas) {
                    $scope.imagemCaracteristica = $scope.caracteristicas[x].imagem;
                    $scope.showModal();
                    break;
                }
            };
            // }, 100);
        };

        $scope.idSelectedCaracteristicas = null;
        $scope.setSelected = function(idSelected) {
            $scope.idSelectedCaracteristicas = idSelected;
        };


        $scope.isCaracteristicasSelecionados = function() {
            var x = 0,
                cont = 0;
            for (x in $scope.caracteristicas) {
                if ($scope.caracteristicas[x].selecionado === true) {
                    cont++;
                }
            };

            if (cont > 0) {
                return true;
            } else {
                return false;
            }
        };

        $scope.adicionarListCaracteristicas = function() {
            var x = 0;
            for (x in $scope.caracteristicas) {
                if ($scope.caracteristicas[x].selecionado === true) {
                    $scope.insetos.caracteristicas.push({
                        "nome": $scope.caracteristicas[x].nome,
                        "_id": $scope.caracteristicas[x]._id
                    })
                }
            }
            console.log($scope.listCaracteristicas);
        };

        $scope.showModal = function() {

            $scope.opts = {
                backdrop: false,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl: 'view/modalImagem.html',
                controller: ModalImagemCtrl,
                resolve: {} // empty storage
            };

            // Caso desejar passar algum dado para a modal
            $scope.opts.resolve.item = function() {
                return angular.copy({
                    name: $scope.imagemCaracteristica
                }); // pass name to Dialog


            };

            console.log($scope.opts.resolve.item());

            var modalInstance = $uibModal.open($scope.opts);

            modalInstance.result.then(function() {
                //on ok button press
            }, function() {
                //on cancel button press
                console.log("Modal Closed");
            });
        };

        $scope.pesquisar = function(valor) {
            var x = 0;
            $scope.resultadoPesquisa = [];
            for (x in $scope.caracteristicas) {
                if ($scope.caracteristicas[x].nome.search(valor) !== -1) {
                    $scope.resultadoPesquisa.push($scope.caracteristicas[x]);
                }
            }
        };

        // $scope.mudarSelecao = function() {
        //   var x = 0, posicoes;
        //
        //   posicoes = retornoPosicao($scope.selecionado)
        // };

        function retornarPosicao(entity, _id, selecao) {
            if (selecao === false || selecao === undefined) {
                for (x in entity) {
                    if (entity._id === _id) {
                        return x;
                    }
                };
            } else {
                for (x in entity) {
                    var array = [];
                    if (entity.selecionado === true) {
                        // retornarPosicao($scope.caracteristicas, entity._id, false);
                        array[x]
                    }
                };
                return array;
            }
        };

        // -------------------------------------------------------------------------------------------
        // ------------------------------ Funções relacionadas ao cadastro de ordem de insetos -------
        // -------------------------------------------------------------------------------------------

        // Mudar o méio de ordenação
        $scope.ordenarPor = function(campo) {
            $scope.criterioDeOrdenacao = campo;
            $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
        };

        function carregarOrdem() {
            $http.get('/api/ordem/listar').then(result, error);

            function result(res) {
                $scope.listOrdem = res.data;
                console.log($scope.listOrdem);
            };

            function error(err) {
                console.log(err);
            };
        };

        $scope.mudarVisibilidadeCadastro = function() {
            $scope.ordemCadastroVisivel = $scope.ordemCadastroVisivel ? false : true;
        };

        $scope.mudarSelecionados = function(x) {
            if(x.selecionado === true){
              $scope.selecionado = true;
            } else {
              $scope.selecionado = false;
            }
        }

        $scope.isSelecionado = function(){
          return $scope.selecionado;
        };

        $scope.adicionarOrdem = function(entity){
          $http.post('api/ordem/cadastro', entity).then(result, error);

          function result(res){
            $scope.ordem = {};
            carregarOrdem();
            console.log(res);
          };

          function error(err){
            console.log(err)
          };
        };

        // Insere no modelo da tela principal
        $scope.associarOrdem = function(close){
          var x = 0;
          console.log($scope);
          for(x in $scope.listOrdem){
            if($scope.listOrdem[x].selecionado === true){
              $scope.insetos.ordem = $scope.listOrdem[x];
              // close();
              console.log("encontrou")
            };
          };
        };

        // -------------------------------------------------------------------------------------------
        // ---------------------- Fim das Funções relacionadas ao cadastro de ordem de insetos -------
        // -------------------------------------------------------------------------------------------

    });

    var ModalImagemCtrl = function($scope, $uibModalInstance, $uibModal, item) {

        $scope.imagemCaracteristica = item.name;

        console.log($scope)
        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    };


    app.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    // --------------------------------------------------- Controle de Cadastros --------------------------------------------

})();
