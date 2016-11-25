var app = angular.module('myApp');

app.controller('gerenciarInsetos', function($scope, $http, $uibModal, usuariosService, Notification){
  usuariosService.init("gerenciar")

})
