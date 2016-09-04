(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('DetalleNotaCreditoController', DetalleNotaCreditoController);

    DetalleNotaCreditoController.$inject = ['$scope', '$timeout', '$rootScope', 'notaCreditoService', 'ngDialog', 'toaster', '$state', '$stateParams', 'detalleNotaCreditoService', 'NgTableParams'];

    function DetalleNotaCreditoController($scope, $timeout, $rootScope, notaCreditoService, ngDialog, toaster, $state, $stateParams, detalleNotaCreditoService, NgTableParams) {
        var vm = this;
        /*VARIABLES*/
        vm.busq = null;
        /*METODOS*/        
        vm.buscarProductoOnFactura = buscarProductoOnFactura;
        vm.eliminarDetalleNota = eliminarDetalleNota;
        vm.listaDetalleNotaCredito = listaDetalleNotaCredito;
        vm.modificarDetalleNota = modificarDetalleNota;
        vm.panelDevolverItem = panelDevolverItem;

        function buscarProductoOnFactura(barcode) {
            detalleNotaCreditoService
                    .getProductoOnFactura(barcode)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            ngDialog.open({
                                template: 'views/nota_credito/modal-busqueda-producto.html',
                                className: 'ngdialog-theme-lg ngdialog-theme-custom',
                                showClose: false,
                                controller: 'DetalleNotaCreditoController as vm',
                                closeByDocument: false,
                                closeByEscape: true,
                                data: {productos: datos.data}
                            });
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: '¡Error!',
                                body: 'No se han encontrado productos.',
                                showCloseButton: false
                            });
                        }
                    });
        }

        function eliminarDetalleNota(detalle) {
            ngDialog.open({
                template: 'views/nota_credito/modal-eliminar-detalle-nota.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalle: detalle}
            });
        }

        function listaDetalleNotaCredito() {
            $scope.detallesNotaCredito = "";
            detalleNotaCreditoService
                    .getNotaCreditoDetail($stateParams.idNota)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.detallesNotaCredito = datos.data;
                            var data = datos.data;
                            $scope.tableDetallesNotaCredito = new NgTableParams({
                                page: 1,
                                count: 5
                            }, {
                                total: data.length,
                                getData: function (params) {
                                    data = $scope.detallesNotaCredito;
                                    params.total(data.length);
                                    if (params.total() <= ((params.page() - 1) * params.count())) {
                                        params.page(1);
                                    }
                                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                }
                            });
                        }
                    });
        }

        function modificarDetalleNota(detalle) {
            ngDialog.open({
                template: 'views/nota_credito/modal-modificar-detalle-nota.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalle: detalle}
            });
        }

        function panelDevolverItem(item) {
            ngDialog.open({
                template: 'views/nota_credito/modal-cargar-cantidad-devolver.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalle: item}
            });
        }

        $scope.$on('updateDetalleNotaCredito2', function (event, object) {
            detalleNotaCreditoService
                    .getNotaCreditoDetail($stateParams.idNota)
                    .then(function (datos) {
                        $scope.detallesNotaCredito = datos.data;
                        $scope.tableDetallesNotaCredito.reload();
                        $rootScope.$broadcast('updateMontoNota', {});
                    });
        });

        $scope.$on('updateDetalleNotaCredito', function (event, object) {
            listaDetalleNotaCredito();
        });

    }

})();