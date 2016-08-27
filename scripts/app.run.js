(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .run(run);

    run.$inject = ['$rootScope', 'hotkeys', '$state'];

    function run($rootScope, hotkeys, $state) {

        var session = require('electron').remote.session;
        var ses = session.fromPartition('persist:name');
        $rootScope.tabs = 0;

        hotkeys.add({
            combo: 'ctrl+tab',
            description: 'Navegar tabs',
            callback: function (event, hotkey) {
                if ($state.current.name === 'login') {
                    event.preventDefault();
                } else {
                    $rootScope.tabs++;
                    if ($state.current.name === 'distribucion' ||
                            $state.current.name === 'distribuir_productos' ||
                            $state.current.name === 'facturas'
                            ) {
                        if ($rootScope.tabs === 4) {
                            $rootScope.tabs = 0;
                        }
                    }
                    if ($state.current.name === 'modificar-perfil' ||
                            $state.current.name === 'factura' ||
                            $state.current.name === 'reserva') {
                        if ($rootScope.tabs === 3) {
                            $rootScope.tabs = 0;
                        }
                    }
                    if ($state.current.name === 'bancos' ||
                            $state.current.name === 'tarjetas' ||
                            $state.current.name === 'pagos' ||
                            $state.current.name === 'productos' ||
                            $state.current.name === 'panel_factura_producto' ||
                            $state.current.name === 'categorias' ||
                            $state.current.name === 'marcas' ||
                            $state.current.name === 'tipos' ||
                            $state.current.name === 'proveedores' ||
                            $state.current.name === 'nota_credito' ||
                            $state.current.name === 'transferencias'
                            ) {
                        if ($rootScope.tabs === 2) {
                            $rootScope.tabs = 0;
                        }
                    }
                }
            }
        });

        $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    /*CAMBIO DE ESTADO*/
                    $rootScope.tabs = 0;
                });

        ses.clearCache(function (response) {
            /*console.log("Cache eliminado: ", response);*/
        });

        ses.cookies.get({name: 'token'}, function (error, cookies) {
            /* console.log(cookies[0]);
             console.log(cookies[0].value);*/
        });

    }

})();