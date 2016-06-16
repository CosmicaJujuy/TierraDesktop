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

            var neonRedMap = $mdThemingProvider.extendPalette('red', {
                '500': 'rgb(218, 50, 45)',
                'contrastDefaultColor': 'dark'
            });
            var whitestMap = $mdThemingProvider.extendPalette('green', {
                '500': '#ffffff'
            });
            $mdThemingProvider.definePalette('neonRed', neonRedMap);
            $mdThemingProvider.definePalette('whitest', whitestMap);
            $mdThemingProvider.theme('greenTheme')
                    .primaryPalette('neonRed')
                    .warnPalette('blue')
                    .accentPalette('green')
                    .backgroundPalette('grey');
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
                                templateUrl: "views/navbar2.html",
                                controller: function ($state) {
                                    console.log($state.current);
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
                                templateUrl: "views/factura_producto/lista.html",
                                controller: 'FacturaProductoController'
                            }
                        }
                    })
                    .state('add_producto_factura', {
                        url: '/productos/factura/:idFactura/add',
                        data: {pageTitle: 'Lista de Productos'},
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
                    });
        })
        .run(function ($state, $stateParams, $location, $cookies, sessionProvider) {
            var session = require('electron').remote.session;
            var ses = session.fromPartition('persist:name');
            ses.cookies.get({name: 'token'}, function (error, cookies) {
                console.log(cookies);
                console.log(cookies[0].value);
            });
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
        .controller('DemoBasicCtrl', function DemoCtrl($mdDialog) {
            this.settings = {
                printLayout: true,
                showRuler: true,
                showSpellingSuggestions: true,
                presentationMode: 'edit'
            };
            this.sampleAction = function (name, ev) {
                $mdDialog.show($mdDialog.alert()
                        .title(name)
                        .textContent('You triggered the "' + name + '" action')
                        .ok('Great')
                        .targetEvent(ev)
                        );
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

