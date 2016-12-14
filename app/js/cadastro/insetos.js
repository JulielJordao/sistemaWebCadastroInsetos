var app = angular.module('myApp');

app.controller('cadastroInsetos', function($scope, $http, $uibModal, $routeParams, usuariosService, Notification, crudService) {

    $scope.insetos = {};
    $scope.insetos.ordem = {};
    $scope.url = {};
    $scope.insetos.caracteristicas = [];
    $scope.ordemCadastroVisivel = false;
    $scope.selecionado = false;
    $scope.view = "cadastro";
    $scope.editMode = false;
    $scope.entidadeSelecionada = {};

    $scope.exibirEscolhidos = true;

    $scope.imagemAlterada = false;

    var rotaInseto = "api/insetos";
    var rotaCaracteristicas = "api/caracteristicas";

    usuariosService.init("cadastro")
    $scope.listCaracteristicas = [];

    usuariosService.testarPermissao();

    // Verifica se está em modo de edição
    if ($routeParams.id !== undefined) {
        $scope.editMode = true;
        importarRegistroEdicao();
    } else {
        $scope.editMode = false;
    }

    var dataRequest = {};
    dataRequest.route = rotaInseto;
    dataRequest.title = "Insetos";

    function importarRegistroEdicao() {
        crudService.obterRegistro(rotaInseto, $routeParams.id, result)

        function result(res) {
            $scope.insetos = res.data;
        }
    };

    $scope.salvarHabilitado = function() {
        if ($scope.editMode === true) {
            if ($scope.imagemAlterada === true) {
                return $scope.cadastroInsetosForm.$invalid || $scope.insetos.caracteristicas.length === 0 ? true : false
            } else {
                return $scope.cadastroInsetosForm.$pristine || $scope.cadastroInsetosForm.$invalid || $scope.insetos.caracteristicas.length === 0 ? true : false
            }
        } else {
            return $scope.cadastroInsetosForm.$invalid === true || $scope.url.image === undefined || $scope.insetos.caracteristicas.length === 0 ? true : false
        }
    };


    $scope.alterarImagem = function() {
        if ($scope.url.image !== undefined && $scope.url.image !== null && $scope.url.image !== "") {
            $scope.imagemAlterada = true;
        }
    };

    //  --------------------------------  Função de Salvar Imagem -----------------------------
    $scope.submeterCadastro = function(file) {
        // $scope.url.image.fshowModalilename = $scope.url.image.name;
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
                config.data.code = $scope.insetos.imagem;
                result(config)
            }

            function result(res) {
                if ($scope.editMode === false) {
                    dataRequest.entity = $scope.insetos
                    $scope.insetos.imagem = res.data.code;
                    crudService.cadastrarRegistro(dataRequest);

                    $scope.cadastroInsetosForm.$pristine = true;
                } else {
                    $scope.insetos.imagem = res.data.code;
                    dataRequest.entity = $scope.insetos;
                    crudService.atualizarRegistro(dataRequest);
                }
            };

            function errorImagem(err) {
                console.log(err);
            }
        }, 100);
    }

    // Remove todos os item inseridos na tabela da tela principal
    $scope.removerTudo = function() {
        $scope.insetos.caracteristicas = [];
        $scope.cadastroInsetosForm.$pristine = true;
    };

    $scope.removerArquivo = function() {
        $scope.files = [];
    };

    $scope.abrirCaracteristicas = function() {
        $scope.showModal();
    }

    $scope.showModalOrdem = function() {
        $scope.opts = {
            backdrop: false,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            templateUrl: 'view/modalOrdem.html',
            controller: modalOrdemCtrl,
            resolve: {} // empty storage
        };

        // $scope.opts.resolve.item = function() {
        //     return $scope
        // };

        $scope.opts.resolve.scope = function() {
            return $scope
        };

        var modalInstance = $uibModal.open($scope.opts);

        modalInstance.result.then(function() {
            //on ok button press
        }, function() {
            // $scope.showModal();

            //on cancel button press
        });
    };

    $scope.showModal = function() {

        $scope.opts = {
            backdrop: false,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            templateUrl: 'view/modalCaracteristicas.html',
            controller: modalCaracteristicasCtrl,
            windowClass: 'modal-caracteristica',
            resolve: {} // empty storage
        };

        // $scope.opts.resolve.item = function() {
        //     return $scope
        // };

        $scope.opts.resolve.scope = function() {
            return $scope
        };

        var modalInstance = $uibModal.open($scope.opts);



        modalInstance.result.then(function() {
            //on ok button press
        }, function() {
            // $scope.showModal();

            //on cancel button press
        });
    };

    $scope.removerLinhaCaracteristica = function(linha) {
        removeByAttr($scope.insetos.caracteristicas, '_id', linha._id)
    };

    // Função que remove um elemento de um array pelo atributo
    var removeByAttr = function(arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i] &&
                arr[i].hasOwnProperty(attr) &&
                (arguments.length > 2 && arr[i][attr] === value)) {

                arr.splice(i, 1);

            }
        }
        return arr;
    }


});

var modalOrdemCtrl = function($scope, $uibModalInstance, $http, $uibModal, $timeout, scope) {

    carregarOrdem();

    var ordemAnterior = null;

    if (scope.insetos.ordem.nome !== undefined) {
        ordemAnterior = scope.insetos.ordem.nome;
    };

    function carregarOrdem() {
        $http.get('/api/ordem/listar').then(result, error);

        function result(res) {
            $scope.listOrdem = res.data;
        };

        function error(err) {

        };
    };

    // -------------------------------------------------------------------------------------------
    // ------------------------------ Funções relacionadas ao cadastro de ordem de insetos -------
    // -------------------------------------------------------------------------------------------

    // Mudar o méio de ordenação
    $scope.ordenarPor = function(campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };
    //
    // $scope.adicionarOrdem = function(entity) {
    //     $http.post('api/ordem/cadastro', entity).then(result, error);
    //
    //     function result(res) {
    //         $scope.ordem = {};
    //         carregarOrdem();
    //         console.log(res);
    //     };
    //
    //     function error(err) {
    //         console.log(err)
    //     };
    // };

    // Insere no modelo da tela principal
    $scope.associarOrdem = function() {
        var x = 0;
        for (x in $scope.listOrdem) {
            if ($scope.listOrdem[x].selecionado === true) {
                scope.insetos.ordem = $scope.listOrdem[x];

                if (scope.insetos.ordem.nome === ordemAnterior) {

                } else {
                    scope.insetos.caracteristicas = $scope.listOrdem[x].caracteristicas;
                }
                // close();
            };
        };

        $scope.close();
    };

    $scope.isSelecionado = function() {
        return $scope.selecionado;
    };

    $scope.mudarSelecionados = function(x) {
        if (x.selecionado === true) {
            $scope.selecionado = true;
        } else {
            $scope.selecionado = false;
        }
    }

    $scope.close = function() {
        $uibModalInstance.close();
    };


    // -------------------------------------------------------------------------------------------
    // ---------------------- Fim das Funções relacionadas ao cadastro de ordem de insetos -------
    // -------------------------------------------------------------------------------------------



};


var modalCaracteristicasCtrl = function($scope, $uibModalInstance, $http, $uibModal, $timeout, scope) {

    $scope.listCaracteristicas = [];

    $scope.resultadoPesquisa = [];

    $scope.imagemCaracteristica = null;

    $scope.idSelectedCaracteristicas = false;

    $scope.idSelectedCaracteristicas = null;
    $scope.setSelected = function(idSelected) {
        $scope.idSelectedCaracteristicas = idSelected;
    };

    // $scope.$parent = item;

    $scope.ok = function() {
        $uibModalInstance.close();
    };


    // --------------------- Função que carrega a lista de caracteristicas -----------------------

    function carregarCaracteristicas() {
        $http.get('api/caracteristicas/listar').then(sucesso, error);

        function sucesso(res) {
            $scope.caracteristicas = res.data;

            var x = 0;
            for(x in $scope.caracteristicas){
              if(verificaSelecionado($scope.caracteristicas[x])){
                $scope.caracteristicas[x].selecionado = true;
              } else {
                $scope.caracteristicas[x].selecionado = false;
              }
            }
        };

        function error(err) {
            console.log(res);
        };
    };

    function verificaSelecionado(entidade){
        var x = 0;

        var selecionado = false;
        for(x in scope.insetos.caracteristicas){
          if(entidade._id === scope.insetos.caracteristicas[x]._id){
            selecionado = true;
            break;
          }
        }

        return selecionado;
    };

    carregarCaracteristicas();

    $scope.mudarVisibilidadeCadastro = function() {
        $scope.ordemCadastroVisivel = $scope.ordemCadastroVisivel ? false : true;
    };

    $scope.mudarSelecionados = function(x) {
        if (x.selecionado === true) {
            $scope.selecionado = true;
        } else {
            $scope.selecionado = false;
        }
    }

    $scope.isSelecionado = function() {
        return $scope.selecionado;
    };


    $scope.showModal = function() {

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
        $scope.opts.resolve.item = function() {
            return angular.copy({
                name: $scope.imagemCaracteristica
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


    $scope.pesquisar = function(valor) {
        var x = 0;
        $scope.resultadoPesquisa = [];
        for (x in $scope.caracteristicas) {
            if ($scope.caracteristicas[x].nome.search(valor) !== -1) {
                $scope.resultadoPesquisa.push($scope.caracteristicas[x]);
            }
        }
    };

    $scope.adicionarListCaracteristicas = function() {
        var x = 0;
        scope.insetos.caracteristicas = [];
        for (x in $scope.caracteristicas) {
            if ($scope.caracteristicas[x].selecionado === true) {
                scope.insetos.caracteristicas.push({
                    "nome": $scope.caracteristicas[x].nome,
                    "_id": $scope.caracteristicas[x]._id
                })
                scope.cadastroInsetosForm.$pristine = true;
            }
        };

        $scope.ok();
    };

    // Carrega qual vai ser a imagem a ser renderizada
    $scope.imagemModal = function() {
        var x = 0;
        $timeout(function() {
            for (x in $scope.caracteristicas) {
                if ($scope.caracteristicas[x]._id === $scope.idSelectedCaracteristicas) {
                    $scope.imagemCaracteristica = $scope.caracteristicas[x].imagem;
                    $scope.showModal();
                    break;
                }
            };
        }, 100);
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


};

var modalImagemCtrl = function($scope, $uibModalInstance, $uibModal, item) {
    $scope.imagem = item.name;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};
