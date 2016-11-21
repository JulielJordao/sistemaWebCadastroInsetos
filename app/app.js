(function() {
    'use strict';
    var app = angular.module('myApp', ['ngRoute', 'angular-growl', 'ui.bootstrap']);

    var login = angular.module('loginApp', ['app']);

    /* Criaremos um controller geral, e aqui adicionaremos algumas configurações*/
    app.controller('pageController', function($scope, usuariosService) {
        $scope.logout = function() {
            usuariosService.logout();
        };
    })

    // --------------------------------------------------- Controle de Acesso --------------------------------------------

    app.service('usuariosService', function($rootScope, $location, $timeout, growl, $http) {
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

                if (res.data.nome === undefined) {
                    window.alert("Login ou senha incorreto");
                } else {
                    window.location.href = "/";
                }
            };

        };

        this.logout = function() {
          console.log("logout")
            $http.get('/api/users/logout').then(result, error);

            function result(res) {
                console.log(res);
            };

            function error(err) {

            };

            $rootScope.usuarioLogado = null;
            $location.path('/index.html#!/')
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

        this.testarPermissao = function() {
            console.log($rootScope);
            if ($rootScope.logado === undefined) {
                console.log("teste")
                growl.error("Não possui permissão de acesso, favor logar!", {title: "ERRO PERMISSÂO!"});
                // window.location.href = "/login.html"
                $timeout(function() {}, 500);

            }
        };
    })

    login.controller('loginController', function($scope, usuariosService) {
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

        $scope.logout = function() {
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
