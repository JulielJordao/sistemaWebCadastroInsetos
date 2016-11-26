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

        $scope.selecionado = false;
        var edicao = false;

        usuariosService.init("cadastro");

        usuariosService.testarPermissao();

        if($routeParams.id !== undefined){
          $scope.edicao = true;
        };

        var dataRequest = {};

        dataRequest.route = "api/caracteristicas";
        dataRequest.title = "Características";

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
              if(edicao === false){
                dataRequest.entity  = {
                    nome: $scope.caracteristica.nomCaracteristica,
                    imagem: res.data.code
                };

                crudService.cadastrarRegistro(dataRequest);

                $scope.cadastroCaracteristicaForm.$pristine = true;
              }
            };

            function errorImagem(err) {
                console.log(err);
            }
        }

        $scope.removerArquivo = function() {
            $scope.files = [];
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
