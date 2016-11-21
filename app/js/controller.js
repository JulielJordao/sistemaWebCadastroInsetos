'use scrict';
  var app = angular.module('myApp');

app.config(
		[ '$routeProvider', '$locationProvider',
				function($routeProvider, $locationProvider) {
					$routeProvider.when('/', {
						templateUrl : 'paginaInicial.html'
						,controller : 'pageController'
					}).when('/cadastroCaracteristicas', {
						templateUrl : 'cadastroCaracteristicas.html',
						controller : 'cadastroCaracteristica'
					}).when('/cadastroInsetos', {
						templateUrl : 'cadastroInsetos.html',
						controller : 'cadastroInsetos'
					})
//           .when('/solucao', {index2
// 						templateUrl : 'cadastroSolucao.html'
// 						// controller : 'CadSolucaoCtrl'
// 					}).when('/planta#!/familia', {
// 						templateUrl : 'modalFamilia.html',
// 						controller : 'CadPlantaCtrl'
// 					})
          .otherwise({
						templateUrl : 'paginaInicial.html',
						controller : 'pageController'
					});

					$locationProvider.html5Mode(false).hashPrefix('!');
				} ]);

// angular.module('pesquisaApp').config(
// 		[ '$routeProvider', '$locationProvider',
// 				function($routeProvider, $locationProvider) {
// 					$routeProvider.when('/', {
// 						templateUrl : 'opcoesPesquisa.html'
// //						,controller : 'pesquisaCtrl'
// 					}).when('/planta', {
// 						templateUrl : 'pesquisaPlanta.html',
// 						controller : 'pesPlantaCtrl'
// 					}).when('/:nomPopular/:codPlanta', {
// 						templateUrl : 'planta.html',
// 						controller : 'pesPlantaCtrl'
// 					}).when('/doenca', {
// 						templateUrl : 'pesquisaDoenca.html',
// 						controller : 'pesDoencaCtrl'
// 					}).when('/doenca/:nomPopular/:codPlanta', {
// 						templateUrl : 'doenca.html',
// 						controller : 'pesDoencaCtrl'
// 					}).otherwise({
// 						templateUrl : 'opcoesPesquisa.html'
// //						controller : 'optionCtrl'
// 					});
// 			$locationProvider.html5Mode(false).hashPrefix('!');
// 	}]);
//
//
// var MyCtrlDialog = function($scope) {
// 	$scope.open = function() {
// 		$scope.showModal = true;
// 	};
// 	$scope.ok = function() {
//
// 		$scope.showModal = false;
// 	};
// 	$scope.cancel = function() {
//
// 		$scope.showModal = false;
// 	};
// };
