'use scrict';
  var app = angular.module('myApp');

app.config(
		[ '$routeProvider', '$locationProvider',
				function($routeProvider, $locationProvider) {
					$routeProvider.when('/', {
						templateUrl : 'paginaInicial.html'
						,controller : 'pageController'
					})


          // Rotas das telas de cadastro
          .when('/cadastroCaracteristicas', {
						templateUrl : 'cadastroCaracteristicas.html',
						controller : 'cadastroCaracteristica'
					}).when('/cadastroInsetos', {
						templateUrl : 'cadastroInsetos.html',
						controller : 'cadastroInsetos'
					}).when('/cadastroOrdem', {
						templateUrl : 'cadastroOrdem.html',
						controller : 'cadastroOrdem'
					})

          // Rotas das telas de edição
          .when('/cadastroCaracteristicas/:id', {
						templateUrl : 'cadastroCaracteristicas.html',
						controller : 'cadastroCaracteristica'
					}).when('/cadastroInsetos/:id', {
						templateUrl : 'cadastroInsetos.html',
						controller : 'cadastroInsetos'
					}).when('/cadastroOrdem/:id', {
						templateUrl : 'cadastroOrdem.html',
						controller : 'cadastroOrdem'
					})

          // Rotas das telas de gerenciamento
          .when('/gerenciarInsetos', {
						templateUrl : 'gerenciarInsetos.html',
						controller : 'gerenciarInsetos'
					}).when('/gerenciarCaracteristicas',{
            templateUrl : 'gerenciarCaracteristicas.html',
						controller : 'gerenciarCaracteristicas'
          }).when('/gerenciarOrdem',{
            templateUrl : 'gerenciarOrdem.html',
						controller : 'gerenciarOrdem'
          })

          // Telas referentes a pesquisa
          .when('/pesquisar',{
            templateUrl : 'pesquisar.html',
						controller : 'pesquisarCtrl'
          }).when('/pesquisar/resultado/:id',{
            templateUrl : 'resultado.html',
						controller : 'resultadoCtrl'
          }).when('/sobre',{
            templateUrl : 'sobre.html',
						controller : 'sobreController'
          }).otherwise({
						templateUrl : 'paginaInicial.html',
						controller : 'pageController'
					});

					$locationProvider.html5Mode(false).hashPrefix('!');
				} ]);
