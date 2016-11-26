var app = angular.module('myApp');

app.controller('gerenciarInsetos',

    function($scope, $http, $uibModal, $rootScope, usuariosService, Notification, $mdDialog, crudService) {

        usuariosService.init("gerenciar");

        var rotaInseto = "/api/insetos";
        //  --------------------- Funções padrões ----------------------------
        // -------------------------------------------------------------------

        $scope.listInsetos = crudService.listar();

        $scope.selecionado = false;

        $scope.showConfirm = function() {
          var confirm = $mdDialog.confirm()
              .title('Remover Registros')
              .textContent('Deseja remover os registros selecionados?')
              .ok('Confirmar')
              .cancel('Cancelar');

              $mdDialog.show(confirm).then(function() {
                  console.log("Confimar")
                  // $scope.status = 'You decided to get rid of your debt.';
              }, function() {
                  console.log("Cancelar")
                  // $scope.status = 'You decided to keep your debt.';
              });
        };

        $scope.showConfirm();

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

        $scope.deletarRegistro = function(titulo, mensagem, route, registro) {

            var testaArray = false,
                x;

            if (registro.length !== undefined) {
                testaArray = true;
            }

            if (testaArray === false) {
                $http.get(route + "/" + registro._id).then(result, error);
            } else {
                for (x in registro) {
                    $http.get(route + "/" + registro._id).then(result, error);
                }
            }

            function result(res) {
                Notification.success({
                    title: titulo,
                    message: "Operação executada com sucesso!"
                })
            };

            function error(err) {
                Notification.error({
                    title: titulo,
                    message: "Ocorreu um erro ao Deletar Registro!"
                })
                console.log(err);
            };
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
        }
    })
