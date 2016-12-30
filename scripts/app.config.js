(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .config(config);

    config.$inject = ['$provide', '$stateProvider', '$httpProvider', '$mdIconProvider', 'colorConfProvider', 'hotkeysProvider', '$mdThemingProvider'];

    function config($provide, $stateProvider, $httpProvider, $mdIconProvider, colorConfProvider, hotkeysProvider, $mdThemingProvider) {

        $httpProvider.interceptors.push(function () {
            return {
                request: function (config) {
                    config.timeout = 60000;
                    return config;
                }
            };
        });

        hotkeysProvider.templateTitle = 'Listado de atajos';
        hotkeysProvider.cheatSheetDescription = 'Mostrar / Ocultar este menu de ayuda.';

        $provide.decorator('BaseURL', function (localStorageService) {
            var xhr = new XMLHttpRequest();
            var URL = localStorageService.get('BaseURL');
            var conexion;
            var Redirect;
            if (URL === null) {
                var data = {
                    BaseUrl: 'https://tierradecoloresapi.herokuapp.com/'
                };
                localStorageService.set('BaseURL', data);
                conexion = data.BaseUrl;
            } else {
                xhr.open("GET", URL.BaseUrl);
                xhr.send();
                xhr.onload = function () {
                    if (this.status === 200) {
                        var data = {
                            RedirectURL: xhr.responseURL
                        };
                        localStorageService.set('RedirectURL', data);
                    }
                };
                Redirect = localStorageService.get('RedirectURL');
                if(Redirect !== null){
                    conexion = Redirect.RedirectURL;
                }                
            }
            console.log("Conexion con: ", URL);
            console.log('Predeterminado: ', conexion);
            console.log("Redirect: ", Redirect);
            return conexion;
        });

        $mdIconProvider
                .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
                .defaultIconSet('styles/icons/sets/core-icons.svg', 24);

        function auth($http, $state, $timeout, cookieService, BaseURL) {
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
        }

        $stateProvider
                .state('login', {
                    url: '/',
                    data: {
                        pageTitle: 'Inicio'
                    },
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
                            controller: 'LoginController as vm'
                        }
                    }
                })
                .state('home', {
                    url: '/home',
                    data: {
                        pageTitle: 'Inicio'
                    },
                    resolve: {
                        auth: auth
                    },
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
                    data: {
                        pageTitle: 'Perfil de usuario'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'UsuarioController as vm'
                        }
                    }
                })
                .state('modificar-perfil', {
                    url: '/perfil/modificar',
                    data: {
                        pageTitle: 'Modificar perfil de usuario'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'UsuarioController as vm'
                        }
                    }
                })
                .state('usuarios', {
                    url: '/usuarios',
                    data: {
                        pageTitle: 'Lista de usuarios'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'UsuarioController as vm'
                        }
                    }
                })
                .state('add_usuario', {
                    url: '/nuevo-usuario',
                    data: {
                        pageTitle: 'Agregar nuevo usuario'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'UsuarioController as vm'
                        }
                    }
                })
                .state('tarjetas', {
                    url: '/tarjetas',
                    data: {
                        pageTitle: 'Panel tarjetas'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'TarjetaController as vm'
                        }
                    }
                })
                .state('bancos', {
                    url: '/bancos',
                    data: {
                        pageTitle: 'Panel entidades financieras'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'EntidadBancariaController as vm'
                        }
                    }
                })
                .state('pagos', {
                    url: '/planes-de-pago',
                    data: {
                        pageTitle: 'Panel planes de Pago'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'PlanPagoController as vm'
                        }
                    }
                })
                .state('productos', {
                    url: '/productos',
                    data: {
                        pageTitle: 'Lista de productos'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'ProductoController as vm'
                        }
                    }
                })
                .state('add_factura_producto', {
                    url: '/productos/factura',
                    data: {
                        pageTitle: 'Crear nueva factura'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'FacturaProductoController as vm'
                        }
                    }
                })
                .state('panel_factura_producto', {
                    url: '/productos/factura/:idFactura',
                    data: {
                        pageTitle: 'Panel de productos'
                    },
                    resolve: {
                        auth: auth
                    },
                    views: {
                        'navbar': {
                            templateProvider: function ($templateRequest, sessionProvider) {
                                var templateName = sessionProvider.getPath();
                                return $templateRequest(templateName);
                            },
                            controller: null
                        },
                        'body': {
                            templateUrl: "views/factura_producto/lista.html",
                            controller: 'FacturaProductoController as vm'
                        }
                    }
                })
                .state('add_producto_factura', {
                    url: '/productos/factura/:idFactura/add',
                    data: {
                        pageTitle: 'Nuevo producto'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'ProductoController as vm'
                        }
                    }
                })
                .state('producto', {
                    url: '/producto/:idProducto',
                    data: {
                        pageTitle: 'Detalle de producto'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'ProductoController as vm'
                        }
                    }
                })
                .state('helper', {
                    url: '/helper',
                    data: {
                        pageTitle: 'Busqueda de productos'
                    },
                    params: {
                        descripcion: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        marca: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        talla: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        codigo: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        categoria: {
                            value: null,
                            dynamic: true,
                            squash: true
                        }
                    },
                    reloadOnSearch: false,
                    resolve: {
                        auth: auth
                    },
                    views: {
                        'navbar': {
                            templateUrl: 'views/producto/helper/helper-navbar.html',
                            controller: null
                        },
                        'body': {
                            templateUrl: 'views/producto/helper/helper-content.html',
                            controller: 'ProductoController as vm'
                        }
                    }
                })
                .state('producto_helper', {
                    url: '/helper/:idProducto',
                    data: {
                        pageTitle: 'Detalle de producto'
                    },
                    resolve: {
                        auth: auth
                    },
                    views: {
                        'navbar': {
                            templateUrl: 'views/producto/helper/helper-navbar.html',
                            controller: null
                        },
                        'body': {
                            templateUrl: "views/producto/helper/detalle_helper.html",
                            controller: 'ProductoController as vm'
                        }
                    }
                })
                .state('busqueda_producto', {
                    url: '/productos/busqueda',
                    data: {
                        pageTitle: 'Busqueda de productos'
                    },
                    params: {
                        descripcion: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        marca: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        talla: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        codigo: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        categoria: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        temporada: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        sexo: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        clase: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        color: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        proveedor: {
                            value: null,
                            dynamic: true,
                            squash: true
                        },
                        factura: {
                            value: null,
                            dynamic: true,
                            squash: true
                        }
                    },
                    reloadOnSearch: false,
                    resolve: {
                        auth: auth
                    },
                    views: {
                        'navbar': {
                            templateProvider: function ($templateRequest, sessionProvider) {
                                var templateName = sessionProvider.getPath();
                                return $templateRequest(templateName);
                            },
                            controller: null
                        },
                        'body': {
                            templateUrl: "views/producto/busqueda_producto.html",
                            controller: 'ProductoController as vm'
                        }
                    }
                })
                .state('distribucion', {
                    url: '/distribuir',
                    data: {
                        pageTitle: 'Panel de distribución'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'DistribucionController as vm'
                        }
                    }
                })
                .state('distribuir_productos', {
                    url: '/distribuir/:idFactura',
                    data: {
                        pageTitle: 'Distribuir factura'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'DistribucionController as vm'
                        }
                    }
                })
                .state('categorias', {
                    url: '/categorias',
                    data: {
                        pageTitle: 'Panel categorias'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'CategoriaController as vm'
                        }
                    }
                })
                .state('marcas', {
                    url: '/marcas',
                    data: {
                        pageTitle: 'Panel marcas'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'MarcaController as vm'
                        }
                    }
                })
                .state('tipos', {
                    url: '/tipos',
                    data: {
                        pageTitle: 'Panel tipo de producto'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'TipoController as vm'
                        }
                    }
                })
                .state('proveedores', {
                    url: '/proveedores',
                    data: {
                        pageTitle: 'Panel proovedores'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'ProveedorController as vm'
                        }
                    }
                })
                .state('proveedor_detalle', {
                    url: '/proveedor/:idProveedor',
                    data: {
                        pageTitle: 'Detalle proovedor'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'ProveedorController as vm'
                        }
                    }
                })
                .state('facturas', {
                    url: '/facturas',
                    data: {
                        pageTitle: 'Panel facturas'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: 'FacturaController as vm'
                        }
                    }
                })
                .state('factura', {
                    url: '/factura/:idFactura',
                    data: {
                        pageTitle: 'Nueva factura'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: "FacturaController as vm"
                        }
                    }
                })
                .state('reserva', {
                    url: '/reserva/:idFactura',
                    data: {
                        pageTitle: 'Nueva reserva'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: "FacturaController as vm"
                        }
                    }
                })
                .state('nota_credito', {
                    url: '/nota',
                    data: {
                        pageTitle: 'Panel de notas de credito'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: "NotaCreditoController as vm"
                        }
                    }
                })
                .state('detalle_nota_credito', {
                    url: '/nota/:idNota',
                    data: {
                        pageTitle: 'Detalle nota de credito'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: "DetalleNotaCreditoController as vm"
                        }
                    }
                })
                .state('detalle_nota_credito.finalizar', {
                    url: '/nota/:idNota/finalizar',
                    data: {
                        pageTitle: 'Finalizar detalle nota de credito'
                    },
                    resolve: {
                        auth: auth
                    },
                    templateUrl: "views/nota_credito/partial-cerrar-nota.html",
                    controller: "NotaCreditoController as vm"
                })
                .state('transferencias', {
                    url: '/transferencias',
                    data: {
                        pageTitle: 'Panel de transferencias'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: "TransferenciaController as vm"
                        }
                    }
                })
                .state('transferencias_detalle', {
                    url: '/transferencia/:idTransferencia',
                    data: {
                        pageTitle: 'Detalles de transferencias'
                    },
                    resolve: {
                        auth: auth
                    },
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
                            controller: "TransferenciaController as vm"
                        }
                    }
                });

    }
})();
