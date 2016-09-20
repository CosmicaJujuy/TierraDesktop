(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp.printer')
            .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider
                .state('doble20x30', {
                    url: '/doble20x30/:talla/:codigo',
                    templateUrl: 'views/producto/printer/etiqueta_doble_20x30.html',
                    params: {
                        talla: {value: null},
                        codigo: {value: null}
                    },
                    controller: 'PrinterController as vm'
                })
                .state('doble34x38', {
                    url: '/doble34x38/:descripcion/:talla/:codigo',
                    templateUrl: 'views/producto/printer/etiqueta_doble_34x38.html',
                    params: {
                        descripcion: {value: null},
                        talla: {value: null},
                        codigo: {value: null}
                    },
                    controller: 'PrinterController as vm'
                })
                .state('izquierda20x30', {
                    url: '/izquierda20x30/:talla/:codigo',
                    templateUrl: 'views/producto/printer/etiqueta_izquierda_20x30.html',
                    params: {
                        descripcion: {value: null},
                        talla: {value: null},
                        codigo: {value: null}
                    },
                    controller: 'PrinterController as vm'
                })
                .state('izquierda34x38', {
                    url: '/izquierda34x38/:descripcion/:talla/:codigo',
                    templateUrl: 'views/producto/printer/etiqueta_izquierda_34x38.html',
                    params: {
                        descripcion: {value: null},
                        talla: {value: null},
                        codigo: {value: null}
                    },
                    controller: 'PrinterController as vm'
                })
                .state('derecha20x30', {
                    url: '/derecha20x30/:talla/:codigo',
                    templateUrl: 'views/producto/printer/etiqueta_derecha_20x30.html',
                    params: {
                        descripcion: {value: null},
                        talla: {value: null},
                        codigo: {value: null}
                    },
                    controller: 'PrinterController as vm'
                })
                .state('derecha34x38', {
                    url: '/derecha34x38/:descripcion/:talla/:codigo',
                    templateUrl: 'views/producto/printer/etiqueta_derecha_34x38.html',
                    params: {
                        descripcion: {value: null},
                        talla: {value: null},
                        codigo: {value: null}
                    },
                    controller: 'PrinterController as vm'
                });
    }

})();