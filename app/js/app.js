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
    app.controller('cadastroCaracteristica', function($scope, $http, $routeParams, usuariosService, Notification, crudService) {

        $scope.selecionado = false, $scope.url = {};
        $scope.caracteristica = {};
        $scope.imagemAlterada = false;

        var edicao = false,
            imagemAlterada = false;

        var routeCaracteristicas = "api/caracteristicas"

        usuariosService.init("cadastro");

        usuariosService.testarPermissao();

        if ($routeParams.id !== undefined) {
            $scope.editMode = true;
            importarRegistroEdicao();
        } else {
            $scope.editMode = false;
        }

        var dataRequest = {};

        dataRequest.route = "api/caracteristicas";
        dataRequest.title = "Características";

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
            if (edicao === true) {
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
                            imagem: res.data.code
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

        $scope.removerArquivo = function() {
            $scope.files = [];
        };

        $scope.alterarImagem = function() {
            if ($scope.url.image !== undefined && $scope.url.image !== null && $scope.url.image !== "") {
                $scope.imagemAlterada = true;
                console.log($scope.imagemAlterada)
            }
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

    // --------------------------------------------------- Controle de Cadastros --------------------------------------------

})();
