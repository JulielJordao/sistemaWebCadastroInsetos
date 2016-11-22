var app = angular.module('myApp');

app.controller('cadastroInsetos', function($scope, $http, $uibModal, usuariosService, Notification) {

    $scope.insetos = {};
    $scope.insetos.ordem = {};
    $scope.insetos.caracteristicas = [];
    $scope.ordemCadastroVisivel = false;
    $scope.selecionado = false;
    $scope.view = "cadastro";

    usuariosService.init("cadastro")
    $scope.listCaracteristicas = [];

    usuariosService.testarPermissao();
    carregarOrdem();

    $scope.logout = function() {
      console.log("aqui")
        usuariosService.logout();
    };

    //  --------------------------------  Função de Salvar Imagem -----------------------------
    $scope.submeterCadastro = function(file) {
        // $scope.url.image.fshowModalilename = $scope.url.image.name;
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
            console.log(res.data);
            $scope.insetos.imagem = res.data.code;
            $http.post('api/insetos/cadastro', $scope.insetos).then(sucesso, error);

            function sucesso(resultado) {
                console.log(resultado);
                Notification.success({message: "Cadastrado com sucesso", title : "Insetos"})
            };

            function error(err) {
              console.log(err)
            }
        };

        function errorImagem(err) {
            console.log(err)
        };
    }

    $scope.removerLinhaCaracteristica = function(x) {
        var x = 0,
            entity = $scope.insetos.caracteristicas;
        for (x in entity) {
            if ($scope.insetos.caracteristicas._id === x._id) {
                console.log(x);
            }
        }
    };

    // Remove todos os item inseridos na tabela da tela principal
    $scope.removerTudo = function() {
        $scope.insetos.caracteristicas = [];
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
            controller: modalCaracteristicasCtrl,
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

    // function retornarPosicao(entity, _id, selecao) {
    //     if (selecao === false || selecao === undefined) {
    //         for (x in entity) {
    //             if (entity._id === _id) {
    //                 return x;
    //             }
    //         };
    //     } else {
    //         for (x in entity) {
    //             var array = [];
    //             if (entity.selecionado === true) {
    //                 // retornarPosicao($scope.caracteristicas, entity._id, false);
    //                 array[x]
    //             }
    //         };
    //         return array;
    //     }
    // };

    // -------------------------------------------------------------------------------------------
    // ------------------------------ Funções relacionadas ao cadastro de ordem de insetos -------
    // -------------------------------------------------------------------------------------------

    // Mudar o méio de ordenação
    $scope.ordenarPor = function(campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    function carregarOrdem() {
        $http.get('/api/ordem/listar').then(result, error);

        function result(res) {
            $scope.listOrdem = res.data;
            console.log($scope.listOrdem);
        };

        function error(err) {
            console.log(err);
        };
    };



    $scope.adicionarOrdem = function(entity) {
        $http.post('api/ordem/cadastro', entity).then(result, error);

        function result(res) {
            $scope.ordem = {};
            carregarOrdem();
            console.log(res);
        };

        function error(err) {
            console.log(err)
        };
    };

    // Insere no modelo da tela principal
    $scope.associarOrdem = function(close) {
        var x = 0;
        console.log($scope);
        for (x in $scope.listOrdem) {
            if ($scope.listOrdem[x].selecionado === true) {
                $scope.insetos.ordem = $scope.listOrdem[x];
                // close();
                console.log("encontrou")
            };
        };
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

    // -------------------------------------------------------------------------------------------
    // ---------------------- Fim das Funções relacionadas ao cadastro de ordem de insetos -------
    // -------------------------------------------------------------------------------------------

});

var modalCaracteristicasCtrl = function($scope, $uibModalInstance, $http, $uibModal, $timeout, scope) {

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
            console.log(res.data);
        };

        function error(err) {
            console.log(res);
        };
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
            controller: ModalImagemCtrl,
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
        for (x in $scope.caracteristicas) {
            if ($scope.caracteristicas[x].selecionado === true) {
                scope.insetos.caracteristicas.push({
                    "nome": $scope.caracteristicas[x].nome,
                    "_id": $scope.caracteristicas[x]._id
                })
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

var ModalImagemCtrl = function($scope, $uibModalInstance, $uibModal, item) {
    $scope.imagemCaracteristica = item.name;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};
