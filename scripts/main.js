'use strict';
var miAppHome = angular.module('tierraDeColoresApp', [
    'ngAnimate',
    'ui.router',
    'anim-in-out',
    'ngMessages',
    'toaster',
    'ngCookies',
    'ngFileUpload',
    'LocalStorageModule',
    'ngMaterial',
    'ui.bootstrap',
    'ngTable',
    'angular-loading-bar'])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    /*Login*/
                    .state('login', {
                        url: '/',
                        data: {pageTitle: 'Inicio de sesión.'},
                        resolve: {},
                        views: {
                            'navbar': {
                                templateUrl: null,
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/login.html",
                                controller: 'LoginController'
                            }
                        }
                    })
                    .state('home', {
                        url: '/home',
                        data: {pageTitle: 'Home.'},
                        views: {
                            'navbar': {
                                templateUrl: "views/navbar.html",
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/inicio.html",
                                controller: null
                            }
                        }
                    })
                    .state('perfil', {
                        url: '/perfil',
                        data: {pageTitle: 'Perfil de usuario.'},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/usuario/perfil.html",
                                controller: 'UsuarioController'
                            }
                        }
                    })
                    .state('modificar-perfil', {
                        url: '/perfil/modificar',
                        data: {pageTitle: 'Modificar perfil de usuario.'},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/usuario/modificarUsuario.html",
                                controller: 'UsuarioController'
                            }
                        }
                    })
                    .state('usuarios', {
                        url: '/usuarios',
                        data: {pageTitle: 'Modificar perfil de usuario.'},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/usuario/lista.html",
                                controller: 'UsuarioController'
                            }
                        }
                    })
                    .state('nuevo-usuario', {
                        url: '/nuevo-usuario',
                        data: {pageTitle: 'Agregar nuevo usuario.'},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/usuario/nuevoUsuario.html",
                                controller: 'UsuarioController'
                            }
                        }
                    })
                    .state('tarjetas', {
                        url: '/tarjetas',
                        data: {pageTitle: 'Panel tarjetas'},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/tarjeta/panelTarjeta.html",
                                controller: 'TarjetaController'
                            }
                        }
                    });
        })
        .run(function ($state, $stateParams, $location, $cookies, sessionProvider) {
            var session = require('electron').remote.session;
            var ses = session.fromPartition('persist:name');
            ses.cookies.get({name: 'token'}, function (error, cookies) {
                console.log(cookies);
                console.log(cookies[0].value);
            });
        });

