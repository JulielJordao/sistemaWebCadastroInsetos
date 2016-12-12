(function() {
    'use strict';
    var app = angular.module('myApp', ['ngRoute', 'ui-notification', 'ui.bootstrap', 'ngMaterial']);

    var login = angular.module('loginApp', ['myApp']);

    /* Criaremos um controller geral, e aqui adicionaremos algumas configurações*/
    app.controller('pageController', function($scope, usuariosService) {
        usuariosService.init("inicial");
    })


    // --------------------------------------------------- Controle de Cadastros --------------------------------------------

    // Controle do cadastro de cadastroCaracteristicas
    app.controller('cadastroCaracteristica', function($scope, $http, $routeParams, $uibModal, usuariosService, Notification, crudService) {

        $scope.selecionado = false, $scope.url = {};
        $scope.caracteristica = {};
        $scope.imagemAlterada = false;
        $scope.primeiraPosicao = true;
        $scope.segundaPosicao = true;

        var edicao = false,
            imagemAlterada = false;

        var routeCaracteristicas = "api/caracteristicas"

        usuariosService.init("cadastro");

        usuariosService.testarPermissao();

        function carregarPrimeiraPosicao() {
            crudService.obterElementoPosicao(1, result)

            function result(res) {
                if (res[0] !== undefined) {
                    $scope.primeiraPosicao = false;
                }
            };
        };

        function carregarSegundaPosicao() {
            crudService.obterElementoPosicao(2, result)

            function result(res) {
                if (res[0] !== undefined) {
                    $scope.segundaPosicao = false;
                }
            };
        };

        carregarPrimeiraPosicao();

        carregarSegundaPosicao();

        if ($routeParams.id !== undefined) {
            $scope.editMode = true;

            importarRegistroEdicao();
        } else {
            $scope.editMode = false;
        }

        var dataRequest = {};

        dataRequest.route = "api/caracteristicas";
        dataRequest.title = "Caracteristicas";

        $scope.mudarPosicao = function(posicao) {
            $scope.caracteristica.posicao = posicao;
            $scope.cadastroCaracteristicaForm.$pristine = false;
            Notification.info({
                title: "Características",
                message: "É necessário salvar para anexar a posição a característica!"
            });
        };

        // -------------------------------------------------------------------------------------------------------------
        // ----------------------------------------- Funções referentes a edição ---------------------------------------

        function importarRegistroEdicao() {
            crudService.obterRegistro(routeCaracteristicas, $routeParams.id, result)

            function result(res) {
                $scope.caracteristica = res.data;
            }
        };

        $scope.alterarImagem = function() {
            if ($scope.url.image !== undefined && $scope.url.image !== null && $scope.url.image !== "") {
                $scope.imagemAlterada = true;
            }
        };

        $scope.salvarHabilitado = function() {
            if ($scope.editMode === true) {
                return $scope.cadastroCaracteristicaForm.$invalid || $scope.cadastroCaracteristicaForm.$pristine ? true : false
            } else {
                return $scope.cadastroCaracteristicaForm.$invalid === true || $scope.url.image === undefined ? true : false
            }
        };


        // ----------------------------------------- Funções referentes a edição ---------------------------------------
        // -------------------------------------------------------------------------------------------------------------

        $scope.submeterCadastro = function(file) {
            // $scope.url.image.filename = $scope.url.image.name;
            setTimeout(function() {
                if ($scope.imagemAlterada === true || $scope.editMode === false) {
                    var file = $scope.url.image;
                    var fd = new FormData();

                    fd.append('image', file);

                    $http.post('api/uploads', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(result, errorImagem);
                } else {
                    var config = {};
                    config.data = {};
                    config.data.code = $scope.caracteristica.imagem;
                    result(config)
                }


                function result(res) {
                    if ($scope.editMode === false) {
                        dataRequest.entity = {
                            nome: $scope.caracteristica.nome,
                            imagem: res.data.code,
                        };

                        crudService.cadastrarRegistro(dataRequest);

                        $scope.cadastroCaracteristicaForm.$pristine = true;
                    } else {
                        $scope.caracteristica.imagem = res.data.code;
                        dataRequest.entity = $scope.caracteristica;
                        crudService.atualizarRegistro(dataRequest);
                    }
                };

                function errorImagem(err) {
                    console.log(err);
                }
            }, 100);
        }

        $scope.alterarImagem = function() {
            if ($scope.url.image !== undefined && $scope.url.image !== null && $scope.url.image !== "") {
                $scope.imagemAlterada = true;
                console.log($scope.imagemAlterada)
            }
        };

        $scope.showModalPosicao = function() {
            $scope.opts = {
                backdrop: false,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl: 'view/modalPosicao.html',
                controller: modalPosicaoCtrl,
                windowClass : 'app-modal-window',
                resolve: {} // empty storage
            };

            $scope.opts.resolve.scope = function() {
                return $scope
            };

            var modalInstance = $uibModal.open($scope.opts);

            modalInstance.result.then(function() {

            }, function() {

            });
        };

        $scope.removerPosicao = function() {
            $scope.caracteristica.posicao = null;
            $scope.cadastroCaracteristicaForm.$pristine = false;
        };

    });

    login.controller('loginController', function($scope, usuariosService) {
        $scope.logar = function(user) {
            usuariosService.validaLogin(user);
        }
    });

    app.controller('inicialController', function($scope, usuariosService) {
        usuariosService("inicial");
    });

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

    var modalPosicaoCtrl = function($scope, $uibModalInstance, $http, $uibModal, $timeout, scope, arvoreService) {

        // Lista de todas as caracteristicas
        $scope.listCaracteristicas = [];

        // entidadeSelecionada selecionada na modal
        $scope.entidadeSelecionada = {};

        // Aramazena qual o objeto de cada posicao
        $scope.elementoPosicao1 = {};
        $scope.elementoPosicao2 = {};

        $scope.posicaoCaracteristicas = "";

        // Muda a label após resultado da pesquisa
        $scope.posicao1 = "-------------";
        $scope.posicao3 = "-------------";
        $scope.posicao4 = "-------------";

        // Carrega os elementos ao abrir a modal
        if (scope.caracteristica.posicao !== undefined) {
            $scope.valorPosicao = scope.caracteristica.posicao;
            if ($scope.valorPosicao > 2) {
                arvoreService.calcularAntecessor($scope.valorPosicao);
            } else {
                $scope.posicao1 = scope.caracteristica.nome;
                carregarSucessores();
            }
        };

        $scope.resultadoPesquisa = [];

        $scope.entidadeSelecionada.nome = "";

        $scope.posicaoSelecionada = null;

        var superiores = [];

        $scope.carregarListCaracteristicas = function() {
            $http.get('api/caracteristicas/listar').then(result, error);

            function result(res) {
                $scope.listCaracteristicas = res.data;
            };

            function error(err) {
                console.log(err);
            };
        };

        $scope.carregarListCaracteristicas();

        $scope.pesquisar = function(valor) {
            var x = 0;
            $scope.resultadoPesquisa = [];
            for (x in $scope.listCaracteristicas) {
                if ($scope.listCaracteristicas[x].nome.search(valor) !== -1) {
                    if ($scope.resultadoPesquisa !== 10) {
                        if ($scope.listCaracteristicas[x].posicao !== undefined) {
                            $scope.resultadoPesquisa.push($scope.listCaracteristicas[x]);
                        }
                    }
                }
            }
        };

        $scope.setSelected = function(selecionado) {
            $scope.posicaoSelecionada = null;
            $scope.entidadeSelecionada = selecionado;
            $scope.posicao1 = $scope.entidadeSelecionada.nome;

            carregarSucessores($scope.entidadeSelecionada.posicao);
        };

        $scope.mudarPosicaoSelecionado = function(posicao) {
            $scope.posicaoSelecionada = posicao;
        };

        $scope.close = function() {
            $uibModalInstance.close();
        };


        // Carrega os galhos sucessores do elemento
        function carregarSucessores(posicao) {

            var superiores = arvoreService.calcularSucessores(posicao);
            var x;

            function retornaSuperiores(valor) {
                $http.get('api/caracteristicas/listar/posicao/' + valor).then(result, error);

                function result(res) {
                    if (valor % 2 === 0) {
                        $scope.elementoPosicao2 = res.data[0];
                        if (res.data[0].nome !== undefined) {
                            $scope.posicao4 = res.data[0].nome;
                        } else {
                            $scope.posicao4 = "-------------";
                        }
                    } else {
                        $scope.elementoPosicao1 = res.data[0];
                        if (res.data[0].nome !== undefined) {
                            $scope.posicao3 = res.data[0].nome;
                        } else {
                            $scope.posicao3 = "-------------";
                        }
                    }
                };

                function error(err) {
                    console.log(err);
                };
            };

            retornaSuperiores(superiores[0]);
            retornaSuperiores(superiores[1]);
        };

        function carregarGalhoInferior(){

        };

        $scope.alterar = function() {

        };

    };

    // --------------------------------------------------- Controle de Cadastros --------------------------------------------

})();
