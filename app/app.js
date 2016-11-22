(function() {
    'use strict';
    var app = angular.module('myApp', ['ngRoute', 'ui-notification', 'ui.bootstrap']);

    var login = angular.module('loginApp', ['myApp']);

    /* Criaremos um controller geral, e aqui adicionaremos algumas configurações*/
    app.controller('pageController', function($scope, usuariosService) {
        usuariosService.init("inicial");
    })

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
                Notification.error({message: "Login ou senha incorretos", title: 'Acesso'});
                // ("Login ou senha incorreto");
            };

            function sucesso(res) {

                if (res.data.nome === undefined) {
                    // growl.error("Login ou senha incorretos");debugger
                    Notification.error({message: "Login e senha incorretos", title: 'Acesso', positionY: 'center', positionX: 'center'})
                    // growl.error("Não possui permissão de acesso, favor logar!", {title: "ERRO PERMISSÂO!"});
                    // window.alert("Login ou senha incorreto");
                } else {
                    Notification.success({message: "Logado com sucesso. Redirecionando ...", title : "Controle de Acesso"})
                    setTimeout(function () {
                      window.location.href = "/";
                    }, 2000);

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
              console.log(err);
            };

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
                console.log(err);
                console.log("Ocorreu um erro ao verificar a sessão");
            };
        };

        this.testarPermissao = function() {
            if ($rootScope.logado === undefined) {
                console.log("teste")
                // growl.error("Não possui permissão de acesso, favor logar!", {title: "ERRO PERMISSÂO!"});
                // window.location.href = "/login.html"
                $timeout(function() {}, 500);

            }
        };

        this.init = function(view){
          $rootScope.view = view;
        }
    })

    login.controller('loginController', function($scope, usuariosService) {
        $scope.logar = function(user) {
            usuariosService.validaLogin(user);
        }
    })

    app.controller('inicialController', function($scope, usuariosService) {
        usuariosService("inicial");
    })


    // Verificar automaticamente se o usuário está logado
    app.run(function($rootScope, $location, $timeout, $http, usuariosService) {
        usuariosService.verificarUsuario();

        $rootScope.logout = function(){
          usuariosService.logout();
        };
    })



    // --------------------------------------------------- Controle de Acesso --------------------------------------------




    // --------------------------------------------------- Controle de Cadastros --------------------------------------------

    // Controle do cadastro de cadastroCaracteristicas
    app.controller('cadastroCaracteristica', function($scope, $http, usuariosService) {

        $scope.selecionado = false;
        usuariosService.init("cadastro");

        // usuariosService.testarPermissao();

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
