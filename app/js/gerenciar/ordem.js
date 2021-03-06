var app = angular.module('myApp');

app.controller('gerenciarOrdem',

    function($scope, $http, $uibModal, $rootScope, usuariosService, Notification, $mdDialog, crudService) {

        usuariosService.init("gerenciar");

        $scope.selecionado = false;

        var rotaOrdem = "/api/ordem";
        //  --------------------- Funções padrões ----------------------------
        // -------------------------------------------------------------------

        $scope.listOrdem = [];
        $scope.ordemSelecionado = {};

        function callbackListar(res) {
            if (res.data !== undefined) {
                $scope.listOrdem = res.data;
            }
        };

        setTimeout(function () {
          usuariosService.testarPermissao();
        }, 300);

        $scope.isEntidadeSelecionada = function() {
            var x,
                cont = 0;
            for (x in $scope.listOrdem) {
                if ($scope.listOrdem[x].selecionado === true) {
                    cont++;
                }
            };

            if (cont > 0) {
                return true;
            } else {
                return false;
            }
        };

        // Botão de Ir para Cadastro - redireciona para a página de edição
        $scope.irParaCadastro = function() {

            var config = {};
            config.title = "Redirecionamento!"
            config.message = "Deseja ir para a tela de edição?"
            config.callback = function() {
                window.location.href = "index.html#!/cadastroOrdem/" + $scope.ordemSelecionado._id;
            };

            $scope.showConfirm(config);
        };

        $scope.removerRegistro = function(isArray) {
            setTimeout(function() {
                if (isArray) {
                    deletarRegistro(rotaOrdem, $scope.listOrdem);
                } else {
                    deletarRegistro(rotaOrdem, $scope.ordemSelecionado);
                };
            }, 150);
            // if()
        };

        crudService.listarRegistros(rotaOrdem, callbackListar);

        $scope.selecionado = false;

        $scope.showConfirm = function(config) {
            var confirm = $mdDialog.confirm()
                // .title('Remover Registros')
                .title(config.title)
                // .textContent('Deseja remover os registros selecionados?')
                .textContent(config.message)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                if (config.callback !== undefined) {
                    config.callback();
                }
            }, function() {
                // return false;
                console.log("Cancelou")
                    // $scope.status = 'You decided to keep your debt.';
            });
        };

        $scope.acessarCadastro = function() {
            var config = {};
            config.title = "Redirecionamento!"
            config.message = "Deseja ir para a tela de cadastro?"
            config.callback = function() {
                window.location.href = "index.html#!/cadastroOrdem";
            };

            $scope.showConfirm(config);

        };

        // $scope.showConfirm();

        $scope.testaSelecinado = function(entidade) {
            var x = 0,
                cont;
            for (x in entidade) {
                if (entidade[x].selecionado === true) {
                    cont++;
                    break;
                }
            }

            return cont === 1 ? false : true;
        };

        function deletarRegistro(route, registro) {

            var config = {};

            config.title = "Inseto";

            var configData = {};

            configData.entity = registro;
            configData.title = "Ordem";
            configData.route = "api/Ordem"

            var testaArray = false,
                x, cont = 0;

            console.log(registro.length !== undefined);

            if (registro.length !== undefined) {
                testaArray = true;
            }

            if (testaArray === false) {
                config.message = "Tem certeza que deseja deletar os registros?";
                config.callback = function() {
                    crudService.deletarRegistro(configData);

                    setTimeout(function() {
                        crudService.listarRegistros(rotaOrdem, callbackListar);
                    }, 500);
                };
                $scope.showConfirm(config)
            } else {

                for (x in registro) {
                    if (registro[x].selecionado === true) {
                        cont++;
                    }
                }

                config.message = "Tem certeza que deseja deletar " + cont + " registros?";
                config.callback = function() {;
                    crudService.deletarRegistro(configData);

                    setTimeout(function() {
                        crudService.listarRegistros(rotaOrdem, callbackListar);
                    }, 500);
                };
                // function() {
                //     for (x in registro) {
                //         $http.get(route + "/" + registro._id).then(result, error);
                //     }
                // }

                $scope.showConfirm(config)
            }

            // function result(res) {
            //   console.log(res)
            //     Notification.success({
            //         title: titulo,
            //         message: "Operação executada com sucesso!"
            //     })
            // };
            //
            // function error(err) {
            //   console.log(err);
            //     Notification.error({
            //         title: titulo,
            //         message: "Ocorreu um erro ao Deletar Registro!"
            //     })
            // };
        };

        $scope.setSelected = function(x) {
            $scope.ordemSelecionado = x;
        };

        //  --------------------- Funções padrões ----------------------------
        // -------------------------------------------------------------------

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        };

        // Carrega qual vai ser a imagem a ser renderizada
        $scope.imagemModal = function() {
            var x = 0;
            setTimeout(function() {
                $scope.showModal($scope.ordemSelecionado);
            }, 100);
        };

        $scope.showModal = function(entidade) {

            $scope.opts = {
                backdrop: false,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl: 'view/modalImagem.html',
                controller: modalImagemCtrl,
                windowClass : 'modal-imagem',
                resolve: {} // empty storage
            };

            // Caso desejar passar algum dado para a modal
            $scope.opts.resolve.item = function() {
                return angular.copy({
                    name: $scope.ordemSelecionado.imagem
                }); // pass name to Dialog
            };

            var modalInstance = $uibModal.open($scope.opts);

            modalInstance.result.then(function() {
                //on ok button press
            }, function() {
                // $scope.showModal();

                //on cancel button press
                console.log("Modal Closed");
            });
        };
    })

var modalImagemCtrl = function($scope, $uibModalInstance, $uibModal, item) {
    $scope.imagem = item.name;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};
