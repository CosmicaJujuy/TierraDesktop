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
    'ngDialog',
    'kendo.directives',
    'ngSanitize',
    'ui.mask',
    'angular-loading-bar'])
        .config(function ($stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {
            $mdIconProvider
                    .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
                    .defaultIconSet('styles/icons/sets/core-icons.svg', 24);
            $mdThemingProvider.theme('default')
                    .primaryPalette('purple')
                    .warnPalette('red')
                    .accentPalette('pink');

            $mdThemingProvider.theme('docs-dark')
                    .primaryPalette('blue')
                    .warnPalette('yellow')
                    .accentPalette('yellow')
//                    .backgroundPalette('deep-purple')
                    .dark();

            var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/logged';
            var auth = function ($rootScope, $http, $state, $timeout, cookieService) {
                var electron = require('electron');
                var window = electron.remote.getCurrentWindow();
                var token = cookieService.get('token');
                token.then(function (data) {
                    $http({
                        url: uri,
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer ' + data,
                            'Content-type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        /*nada por ahora*/
                    }, function errorCallback(response) {
                        if (response.status === 401) {
                            $state.go('login');
                            window.setMaximizable(false);
                            $timeout(function timer() {
                                window.unmaximize();
                                window.setResizable(false);
                            }, 1000);
                        }
                    });
                });
            };

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
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateUrl: "views/navbar2.html",
                                controller: function ($state) {

                                }
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
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
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
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
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
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
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
                    .state('add_usuario', {
                        url: '/nuevo-usuario',
                        data: {pageTitle: 'Agregar nuevo usuario.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
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
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
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
                    })
                    .state('bancos', {
                        url: '/bancos',
                        data: {pageTitle: 'Panel entidades financieras'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/banco/panelBanco.html",
                                controller: 'EntidadBancariaController'
                            }
                        }
                    })
                    .state('pagos', {
                        url: '/planes-de-pago',
                        data: {pageTitle: 'Panel Planes de Pago'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/planes/panelPlanes.html",
                                controller: 'PlanPagoController'
                            }
                        }
                    })
                    .state('productos', {
                        url: '/productos',
                        data: {pageTitle: 'Lista de Productos'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/producto/lista.html",
                                controller: 'ProductoController'
                            }
                        }
                    })
                    .state('add_factura_producto', {
                        url: '/productos/factura',
                        data: {pageTitle: 'Crear nueva factura.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/factura_producto/agregarFactura.html",
                                controller: 'FacturaProductoController'
                            }
                        }
                    })
                    .state('panel_factura_producto', {
                        url: '/productos/factura/:idFactura',
                        data: {pageTitle: 'Panel de productos'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: 'FacturaProductoController'
                            },
                            'body': {
                                templateUrl: "views/factura_producto/lista.html",
                                controller: 'FacturaProductoController'
                            }
                        }
                    })
                    .state('add_producto_factura', {
                        url: '/productos/factura/:idFactura/add',
                        data: {pageTitle: 'Nuevo producto.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/producto/agregarProducto.html",
                                controller: 'ProductoController'
                            }
                        }
                    })
                    .state('producto', {
                        url: '/producto/:idProducto',
                        data: {pageTitle: 'Detalle de Producto'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/producto/detalleProducto.html",
                                controller: 'ProductoController'
                            }
                        }
                    })
                    .state('distribucion', {
                        url: '/distribuir',
                        data: {pageTitle: 'Panel de distribución.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/distribucion/distribucionPanel.html',
                                controller: 'DistribucionController'
                            }
                        }
                    })
                    .state('distribuir_productos', {
                        url: '/distribuir/:idFactura',
                        data: {pageTitle: 'Distribuir factura.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/distribucion/distribuir.html',
                                controller: 'DistribucionController'
                            }
                        }
                    })
                    .state('categorias', {
                        url: '/categorias',
                        data: {pageTitle: 'Panel Categorias.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/categoria/categoriaPanel.html',
                                controller: 'CategoriaController'
                            }
                        }
                    })
                    .state('marcas', {
                        url: '/marcas',
                        data: {pageTitle: 'Panel Marcas.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/marcas/marcasPanel.html',
                                controller: 'MarcaController'
                            }
                        }
                    })
                    .state('tipos', {
                        url: '/tipos',
                        data: {pageTitle: 'Panel Tipo de Producto.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/tipo/panelTipo.html',
                                controller: 'TipoController'
                            }
                        }
                    })
                    .state('proveedores', {
                        url: '/proveedores',
                        data: {pageTitle: 'Panel Proovedores.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/proveedor/proveedorPanel.html',
                                controller: 'ProveedorController'
                            }
                        }
                    })
                    .state('proveedor_detalle', {
                        url: '/proveedor/:idProveedor',
                        data: {pageTitle: 'Detalle Proovedor.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/proveedor/detalleProveedor.html',
                                controller: 'ProveedorController'
                            }
                        }
                    })
                    .state('facturas', {
                        url: '/facturas',
                        data: {pageTitle: 'Panel facturas.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/factura/lista.html',
                                controller: 'FacturaController'
                            }
                        }
                    })
                    .state('factura', {
                        url: '/factura/:idFactura',
                        data: {pageTitle: 'Nueva factura.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/factura/facturaPanel.html",
                                controller: "FacturaController"
                            }
                        }
                    })
                    .state('nota_credito', {
                        url: '/nota',
                        data: {pageTitle: 'Panel de Notas de credito.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/nota_credito/panelNotaCredito.html",
                                controller: "NotaCreditoController"
                            }
                        }
                    })
                    .state('detalle_nota_credito', {
                        url: '/nota/:idNota',
                        data: {pageTitle: 'Detalle nota de credito.'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName;
                                    if (sessionProvider.getPath() === "admin") {
                                        templateName = 'views/navbar2.html';
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/nota_credito/detalle.html",
                                controller: "DetalleNotaCreditoController"
                            }
                        }
                    });
        })
        .run(function ($state, $stateParams, $location, $cookies, sessionProvider,$rootScope) {
            var session = require('electron').remote.session;
            var ses = session.fromPartition('persist:name');
            ses.cookies.get({name: 'token'}, function (error, cookies) {
                console.log(cookies);
                console.log(cookies[0].value);
            });
            $rootScope.navbar2 = false;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//                console.log(toState.name);
                if (toState.name === 'home') {
                    $rootScope.navbar2 = false;
                } else {
                    $rootScope.navbar2 = true;
                }
            });
//            var fs = require('fs');
//            var date = new Date().getTime().toString();
//            console.log(date);
//            fs.writeFile("file" + date + ".200", "9" + String.fromCharCode(28) + "Z\n"
//                    + "9" + String.fromCharCode(28) + "Z"
//                    , function (err) {
//                        if (err) {
//                            return console.log(err);
//                        }
//                    });
//            var exec = require('child_process').exec;
//            var child = exec('type file' + date + '.200', function (err, stdout, stderr) {
//                console.log(stdout);
//                console.log(stderr);
//                console.log(err);
//            });
//            console.log(child);
        })
        .filter('keyboardShortcut', function ($window) {
            return function (str) {
                if (!str)
                    return;
                var keys = str.split('-');
                var isOSX = /Mac OS X/.test($window.navigator.userAgent);
                var seperator = (!isOSX || keys.length > 2) ? '+' : '';
                var abbreviations = {
                    M: isOSX ? '⌘' : 'Ctrl',
                    A: isOSX ? 'Option' : 'Alt',
                    S: 'Shift'
                };
                return keys.map(function (key, index) {
                    var last = index == keys.length - 1;
                    return last ? key : abbreviations[key];
                }).join(seperator);
            };
        })
        .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log) {
            $scope.toggleLeft = buildDelayedToggler('left');
            $scope.toggleRight = buildToggler('right');
            $scope.isOpenRight = function () {
                return $mdSidenav('right').isOpen();
            };
            /**
             * Supplies a function that will continue to operate until the
             * time is up.
             */
            function debounce(func, wait, context) {
                var timer;
                return function debounced() {
                    var context = $scope,
                            args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildDelayedToggler(navID) {
                return debounce(function () {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                            .toggle()
                            .then(function () {
                                $log.debug("toggle " + navID + " is done");
                            });
                }, 200);
            }
            function buildToggler(navID) {
                return function () {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                            .toggle()
                            .then(function () {
                                $log.debug("toggle " + navID + " is done");
                            });
                }
            }
        })
        .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
            $scope.close = function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav('right').close()
                        .then(function () {
                            $log.debug("close RIGHT is done");
                        });
            };
        });

