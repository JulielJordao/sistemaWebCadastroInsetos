var app = angular.module('myApp');

app.controller('cadastroOrdem', function($scope, $http, $uibModal, $routeParams, usuariosService, crudService, Notification) {

    $scope.ordem = {};
    $scope.ordem.caracteristicas = [];
    $scope.selecionado = false;
    $scope.view = "cadastro";

    usuariosService.init("cadastro")
    $scope.listCaracteristicas = [];

    $scope.editMode = false;

    $scope.imagemAlterada = false;

    usuariosService.testarPermissao();

    var rotaOrdem = "api/ordem";

    var dataRequest = {};
    dataRequest.route = "api/ordem";
    dataRequest.title = "Ordem"


    // -------------------------------------------------------------------------------------------------------------
    // ----------------------------------------- Funções referentes a edição ---------------------------------------

    if ($routeParams.id !== undefined) {
        $scope.editMode = true;
        importarRegistroEdicao();
    }else {
        $scope.editMode = false;
    }

    function importarRegistroEdicao() {
        crudService.obterRegistro(rotaOrdem, $routeParams.id, result)

        function result(res) {
          $scope.ordem = res.data;
        }
    };

    $scope.salvarHabilitado = function() {
        if ($scope.editMode === true) {
          if($scope.imagemAlterada === true){
            return $scope.cadastroOrdemForm.$invalid || $scope.ordem.caracteristicas.length === 0 ? true : false
          } else {
            return $scope.cadastroOrdemForm.$pristine  || $scope.cadastroOrdemForm.$invalid || $scope.ordem.caracteristicas.length === 0 ? true : false
          }
        } else {
            return $scope.cadastroOrdemForm.$invalid === true || $scope.url.image === undefined || $scope.ordem.caracteristicas.length === 0 ? true : false
        }
    };

    $scope.alterarImagem = function() {
        if ($scope.url.image !== undefined && $scope.url.image !== null && $scope.url.image !== "") {
            $scope.imagemAlterada = true;
        }
    };


    // ----------------------------------------- Funções referentes a edição ---------------------------------------
    // -------------------------------------------------------------------------------------------------------------

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
              config.data.code = $scope.ordem.imagem;
              result(config)
            }

            function result(res) {
                if ($scope.editMode === false) {
                    $scope.ordem.imagem = res.data.code;
                    dataRequest.entity = $scope.ordem

                    crudService.cadastrarRegistro(dataRequest);

                    $scope.cadastroOrdemForm.$pristine = true;
                } else {
                    $scope.ordem.imagem = res.data.code;
                    dataRequest.entity = $scope.ordem;
                    crudService.atualizarRegistro(dataRequest);
                }
            };

            function errorImagem(err) {
                console.log(err);
            }
        }, 100);
    }

    $scope.removerLinhaCaracteristica = function(x) {
        var x = 0,
            entity = $scope.ordem.caracteristicas;
        for (x in entity) {
            if ($scope.ordem.caracteristicas._id === x._id) {
                console.log(x);
            }
        }
    };

    // Remove todos os item inseridos na tabela da tela principal
    $scope.removerTudo = function() {
        $scope.ordem.caracteristicas = [];
        $scope.cadastroOrdemForm.$pristine = true;
    };

    $scope.removerArquivo = function() {
        $scope.files = [];
    };

    $scope.abrirCaracteristicas = function() {
        $scope.showModal();
    }

    $scope.showModal = function() {

        $scope.opts = {
            backdrop: false,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            templateUrl: 'view/modalCaracteristicas.html',
            controller: modalCaracteristicasOrdemCtrl,
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
            console.log("Modal Closed");
        });
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

    $scope.removerLinhaCaracteristica = function(linha) {
        removeByAttr($scope.ordem.caracteristicas, '_id', linha._id)
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

var modalCaracteristicasOrdemCtrl = function($scope, $uibModalInstance, $http, $uibModal, $timeout, scope) {

    $scope.listCaracteristicas = [];

    $scope.resultadoPesquisa = [];

    $scope.imagemCaracteristica = null;

    $scope.idSelectedCaracteristicas = false;

    console.log(scope)

    $scope.idSelectedCaracteristicas = null;
    $scope.setSelected = function(idSelected) {
        $scope.idSelectedCaracteristicas = idSelected;
        console.log($scope.idSelectedCaracteristicas)
    };

    // $scope.$parent = item;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    console.log($scope);

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
        for(x in scope.ordem.caracteristicas){
          if(entidade._id === scope.ordem.caracteristicas[x]._id){
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
            windowClass : 'modal-imagem',
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
        scope.ordem.caracteristicas = [];
        for (x in $scope.caracteristicas) {
            if ($scope.caracteristicas[x].selecionado === true) {
                scope.ordem.caracteristicas.push({
                    "nome": $scope.caracteristicas[x].nome,
                    "_id": $scope.caracteristicas[x]._id
                })
                scope.cadastroOrdemForm.$pristine = true;
            }
        };

        $scope.ok();
    };

    // Carrega qual vai ser a imagem a ser renderizada
    $scope.imagemModal = function() {
        var x = 0;
        $timeout(function () {
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

// -------------------------------------------------------------------------------------------
// ---------------------- Fim das Funções relacionadas ao cadastro de ordem de insetos -------
// -------------------------------------------------------------------------------------------

var modalImagemCtrl = function ($scope, $uibModalInstance, $uibModal, item) {
    $scope.imagem = item.name;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};
