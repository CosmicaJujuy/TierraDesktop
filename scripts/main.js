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
    'cfp.hotkeys',
    'hm.readmore',
    'angular-loading-bar'])
        .value('BaseURL', (function () {
            var resource = 'http://';
            return resource;
        })())
        .config(function (
                $provide,
                $stateProvider,
                $httpProvider,
                $urlRouterProvider,
                $mdIconProvider,
                colorConfProvider,
                hotkeysProvider,
                $mdThemingProvider) {

            $httpProvider.interceptors.push(function () {
                return {
                    request: function (config) {
                        /*config.timeout = 15000;*/
                        return config;
                    }
                };
            });

            hotkeysProvider.templateTitle = 'Listado de atajos';
            hotkeysProvider.cheatSheetDescription = 'Mostrar / Ocultar este menu de ayuda.';

            $provide.decorator('BaseURL', function ($delegate, localStorageService, $state) {
                var URL = localStorageService.get('BaseURL');
                var conexion;
                if (URL === null) {
                    var data = {BaseUrl: 'https://tierradecoloresapi.herokuapp.com/'};
                    localStorageService.set('BaseURL', data);
                    conexion = data.BaseUrl;
                } else {
                    conexion = URL.BaseUrl;
                }
                console.log("Conexion con: ", URL, 'Predeterminado: ', conexion);
                return conexion;
            });
            $mdIconProvider
                    .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
                    .defaultIconSet('styles/icons/sets/core-icons.svg', 24);
            $mdThemingProvider.theme('docs-dark')
                    .primaryPalette(colorConfProvider.colorPalette().primaryPalette)
                    .warnPalette(colorConfProvider.colorPalette().warnPalette)
                    .accentPalette(colorConfProvider.colorPalette().accentPalette)
                    .backgroundPalette(colorConfProvider.colorPalette().backgroundPalette)
                    .dark(colorConfProvider.colorPalette().dark);


            var auth = function ($http, $state, $timeout, cookieService, BaseURL) {
                var uri = BaseURL + 'usuarios/logged';
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
                    .state('loading', {
                        url: '/a',
                        data: {pageTitle: 'Primer uso de aplicación'},
                        resolve: {},
                        views: {
                            'navbar': {
                                templateUrl: null,
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/loading.html",
                                controller: 'LoadingController as loading'
                            }
                        }
                    })
                    .state('login', {
                        url: '/',
                        data: {pageTitle: 'Inicio'},
                        resolve: {},
                        views: {
                            'navbar': {
                                templateUrl: null,
                                controller: null
                            },
                            'body': {
                                templateProvider: function ($templateRequest, localStorageService) {
                                    var setup = localStorageService.get('setup');
                                    var templateName;
                                    if (setup !== null) {
                                        templateName = "views/login.html";
                                    } else {
                                        templateName = "views/loading.html";
                                    }
                                    return $templateRequest(templateName);
                                },
                                controller: 'LoginController'
                            }
                        }
                    })
                    .state('home', {
                        url: '/home',
                        data: {pageTitle: 'Inicio'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
                                    return $templateRequest(templateName);
                                },
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
                        data: {pageTitle: 'Perfil de usuario'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Modificar perfil de usuario'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Lista de usuarios'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Agregar nuevo usuario'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                                    var templateName = sessionProvider.getPath();
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
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Panel planes de Pago'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Lista de productos'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Crear nueva factura'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Nuevo producto'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Detalle de producto'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                    .state('helper', {
                        url: '/helper',
                        data: {pageTitle: 'Busqueda de productos'},
                        params: {
                            descripcion: {value: null, dynamic: true, squash: true},
                            marca: {value: null, dynamic: true, squash: true},
                            talla: {value: null, dynamic: true, squash: true},
                            codigo: {value: null, dynamic: true, squash: true},
                            categoria: {value: null, dynamic: true, squash: true}
                        },
                        reloadOnSearch: false,
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateUrl: 'views/producto/helper/helper-navbar.html',
                                controller: null
                            },
                            'body': {
                                templateUrl: 'views/producto/helper/helper-content.html',
                                controller: 'ProductoController'
                            }
                        }
                    })
                    .state('producto_helper', {
                        url: '/helper/:idProducto',
                        data: {pageTitle: 'Detalle de producto'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateUrl: 'views/producto/helper/helper-navbar.html',
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/producto/helper/detalle_helper.html",
                                controller: 'ProductoController'
                            }
                        }
                    })
                    .state('busqueda_producto', {
                        url: '/productos/busqueda',
                        data: {pageTitle: 'Busqueda de productos'},
                        params: {
                            descripcion: {value: null, dynamic: true, squash: true},
                            marca: {value: null, dynamic: true, squash: true},
                            talla: {value: null, dynamic: true, squash: true},
                            codigo: {value: null, dynamic: true, squash: true},
                            categoria: {value: null, dynamic: true, squash: true},
                            temporada: {value: null, dynamic: true, squash: true},
                            sexo: {value: null, dynamic: true, squash: true},
                            clase: {value: null, dynamic: true, squash: true},
                            color: {value: null, dynamic: true, squash: true},
                            proveedor: {value: null, dynamic: true, squash: true},
                            factura: {value: null, dynamic: true, squash: true}
                        },
                        reloadOnSearch: false,
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/producto/busqueda_Producto.html",
                                controller: 'ProductoController'
                            }
                        }
                    })
                    .state('distribucion', {
                        url: '/distribuir',
                        data: {pageTitle: 'Panel de distribución'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Distribuir factura'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Panel categorias'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Panel marcas'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Panel tipo de producto'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Panel proovedores'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Detalle proovedor'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Panel facturas'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Nueva factura'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                    .state('reserva', {
                        url: '/reserva/:idFactura',
                        data: {pageTitle: 'Nueva reserva'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/reserva/reservaPanel.html",
                                controller: "FacturaController"
                            }
                        }
                    })
                    .state('nota_credito', {
                        url: '/nota',
                        data: {pageTitle: 'Panel de notas de credito'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
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
                        data: {pageTitle: 'Detalle nota de credito'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/nota_credito/detalle.html",
                                controller: "DetalleNotaCreditoController"
                            }
                        }
                    })
                    .state('detalle_nota_credito.finalizar', {
                        url: '/nota/:idNota/finalizar',
                        data: {pageTitle: 'Finalizar detalle nota de credito'},
                        resolve: {auth: auth},
                        templateUrl: "views/nota_credito/partial-cerrar-nota.html",
                        controller: "DetalleNotaCreditoController"
                    })
                    .state('transferencias', {
                        url: '/transferencias',
                        data: {pageTitle: 'Panel de transferencias'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/transferencia/lista-de-transferencias.html",
                                controller: "TransferenciaController"
                            }
                        }
                    })
                    .state('transferencias_detalle', {
                        url: '/transferencia/:idTransferencia',
                        data: {pageTitle: 'Detalles de transferencias'},
                        resolve: {auth: auth},
                        views: {
                            'navbar': {
                                templateProvider: function ($templateRequest, sessionProvider) {
                                    var templateName = sessionProvider.getPath();
                                    return $templateRequest(templateName);
                                },
                                controller: null
                            },
                            'body': {
                                templateUrl: "views/transferencia/detalle.html",
                                controller: "TransferenciaController"
                            }
                        }
                    });
        })
        .run(function ($rootScope) {
            $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {
                        /*CAMBIO DE ESTADO*/
                    });
            var session = require('electron').remote.session;
            var ses = session.fromPartition('persist:name');
            ses.clearCache(function (response) {
                /*console.log("Cache eliminado: ", response);*/
            });
            ses.cookies.get({name: 'token'}, function (error, cookies) {
                /* console.log(cookies[0]);
                 console.log(cookies[0].value);*/
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
                    M: isOSX ? 'âŒ˜' : 'Ctrl',
                    A: isOSX ? 'Option' : 'Alt',
                    S: 'Shift'
                };
                return keys.map(function (key, index) {
                    var last = index == keys.length - 1;
                    return last ? key : abbreviations[key];
                }).join(seperator);
            };
        })
        .provider('colorConf', function colorConfProvider() {
            var palette = {
                primaryPalette: 'blue',
                warnPalette: 'red',
                accentPalette: 'yellow',
                backgroundPalette: 'grey',
                dark: false
            };
            var Config = require('electron-config');
            var config = new Config();
            this.colorPalette = function () {
                if (typeof config.get('Color') === 'undefined') {
                    console.log("Colores reconfigurados");
                    config.set('Color', palette);
                }
                return config.get('Color');
            };
            this.$get = [function colorConfFactory() {
                    return new colorConfLauncher(colorPalette);
                }];
        })
        .filter('capitalize', function () {
            return function (input) {
                return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
            };
        });
