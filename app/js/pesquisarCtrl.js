var app = angular.module('myApp');

app.controller('pesquisaCtrl',

    function($scope, $http, $uibModal, $rootScope, usuariosService, Notification, $mdDialog, crudService) {

      function calcularPosicaoArvore(posicao){
        var pos = 1, x = 2, arvoreAnterior = 2;

        if(posicao > 2) {
          for(x = 4, true, x * 2){
            pos++;
            if(posicao > arvoreAnterior &&  posicao <= x){
              break;
            }
          };
        }
        return pos;
      }


    });
