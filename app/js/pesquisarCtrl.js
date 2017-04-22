var app = angular.module('myApp');

app.controller('pesquisarCtrl',

    function ($scope, $http, $uibModal, $rootScope, $mdDialog, usuariosService, Notification, crudService, arvoreService) {

        usuariosService.init("pesquisar")

        $scope.botao1 = "Sem Valor - Op. 1";
        $scope.botao2 = "Sem Valor - Op. 2";

        $scope.pagina = 1;

        $scope.elementoPosicao1 = {};
        $scope.elementoPosicao2 = {};

        var rotaInseto = 'api/insetos';
        var rotaOrdem = 'api/ordem';

        var ordemEncontrado = false;
        var insetoEncontrado = false;

        var filtar = function () {
            if (ordemEncontrado) {
                // realizar a redução do vetor de insetos até encontrar
            } else {
                // realizar a redução do vetor de ordem até encontrar
            }
        };

        // Obtem a lista dos insetos/ordem
        function obterLista(elemento) {
            switch (elemento) {
                case 'insetos':
                    crudService.listarRegistros(rotaInseto, sucessoInseto)

                    function sucessoInseto(res) {
                        $scope.listInsetos = res.data;
                    }
                    break;
                case 'ordem':
                    crudService.listarRegistros(rotaOrdem, sucessoOrdem)

                    function sucessoOrdem(res) {
                        $scope.listOrdem = res.data;
                    }
                    break;
            }
        };

        var posicoes = [];

        posicoes.push(1);
        posicoes.push(2);

        // Botão reiniciar
        $scope.reiniciar = function () {
            posicoes = [1, 2]
            carregarElementosIniciais();
            obterLista('insetos');
            obterLista('ordem');
            $scope.pagina = 1;
        };

        // Carrega os galhos sucessores do elemento
        function carregarSucessores(posicao) {
            $scope.pagina++;
            posicoes = arvoreService.calcularSucessores(posicao);
            var x;

            function retornaSuperiores(valor) {
                console.log(valor);
                $http.get('api/caracteristicas/listar/posicao/' + valor).then(result, error);

                function result(res) {
                    if (valor % 2 === 0) {
                        $scope.elementoPosicao2 = res.data[0];
                        if (res.data[0] !== undefined) {
                            $scope.botao2 = res.data[0].nome;
                        } else {
                            $scope.botao2 = "Sem Valor - Op. 2";
                        }
                    } else {
                        $scope.elementoPosicao1 = res.data[0];
                        if (res.data[0] !== undefined) {
                            $scope.botao1 = res.data[0].nome;
                        } else {
                            $scope.botao1 = "Sem Valor - Op. 1";
                        }
                    }
                };

                function error(err) {
                    console.log(err);
                };
            };

            retornaSuperiores(posicoes[0]);
            retornaSuperiores(posicoes[1]);
        };

        function carregarElementosIniciais() {
            function retornaSuperiores(valor) {
                $http.get('api/caracteristicas/listar/posicao/' + valor).then(result, error);

                function result(res) {
                    if (valor % 2 === 0) {
                        $scope.elementoPosicao2 = res.data[0];

                        if (res.data[0].nome !== undefined) {
                            $scope.botao2 = res.data[0].nome;
                        } else {
                            $scope.botao2 = "Sem Valor - Op. 2";
                        }
                    } else {
                        $scope.elementoPosicao1 = res.data[0];
                        if (res.data[0].nome !== undefined) {
                            $scope.botao1 = res.data[0].nome;
                        } else {
                            $scope.botao1 = "Sem Valor - Op. 1";
                        }
                    }
                };

                function error(err) {
                    console.log(err);
                };
            };

            retornaSuperiores(1);
            retornaSuperiores(2);
        };

        carregarElementosIniciais();

        $scope.showModalImagem = function (imagem) {

            $scope.opts = {
                backdrop: false,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                templateUrl: 'view/modalImagem.html',
                controller: modalImagemCtrl,
                windowClass: 'modal-imagem',
                resolve: {} // empty storage
            };

            // Caso desejar passar algum dado para a modal
            $scope.opts.resolve.item = function () {
                return angular.copy({
                    name: imagem
                }); // pass name to Dialog
            };

            var modalInstance = $uibModal.open($scope.opts);

            modalInstance.result.then(function () {
                //on ok button press
            }, function () {
                // $scope.showModal();

                //on cancel button press
                console.log("Modal Closed");
            });
        };

        $scope.escolha = function (valor) {
            if (valor === 1) {
                carregarSucessores($scope.elementoPosicao1.posicao);
                // filtrar();
            };

            if (valor === 2) {
                carregarSucessores($scope.elementoPosicao2.posicao);
                // filtrar();
            };
        };

        function redirecionar(id) {
            window.location.href = "index.html#!/pesquisar/resultado/" + id;
        };

        obterLista('insetos');
        obterLista('ordem');

    });

app.controller('resultadoCtrl',

    function ($scope, $http, $uibModal, $routeParams, $rootScope, $mdDialog, usuariosService, crudService) {

        usuariosService.init("pesquisar")

        var rotaInseto = "api/insetos";

        function importarRegistroEdicao() {
            crudService.obterRegistro(rotaInseto, $routeParams.id, result)

            function result(res) {
                $scope.insetos = res.data;
                console.log(res.data)
            }
        };

        importarRegistroEdicao()

    });