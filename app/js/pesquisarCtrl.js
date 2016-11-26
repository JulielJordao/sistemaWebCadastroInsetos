var app = angular.module('myApp');

app.controller('pesquisarCtrl',

    function($scope, $http, $uibModal, $rootScope, usuariosService, Notification, $mdDialog, crudService) {

      usuariosService.init("pesquisar")

    });
