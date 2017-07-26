(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .controller('FiscalController', FiscalController);

    FiscalController.$inject = ['$scope', 'toaster', 'metodoPagoFacturaService', '$rootScope', 'ngDialog', '$stateParams', 'fiscalService', 'cookieService', 'facturaService'];

    function FiscalController($scope, toaster, metodoPagoFacturaService, $rootScope, ngDialog, $stateParams, fiscalService, cookieService, facturaService) {
        var vm = this;
        /*VARIABLES*/
        $scope.comprobanteFiscal = null;
        $scope.vendedorFiscal = null;
        vm.disableBtnsRegalo = false;
        vm.btnDisabled = false;
        /*METODOS*/
        vm.accesoFiscal = accesoFiscal;
        vm.confirmarImpresion = confirmarImpresion;
        vm.confirmarImpresionRegalo = confirmarImpresionRegalo;
        vm.finalizarComprobanteZ = finalizarComprobanteZ;
        vm.imprimir = imprimir;
        vm.imprimirComprobanteZ = imprimirComprobanteZ;
        vm.imprimirTicketRegalo = imprimirTicketRegalo;
        vm.listaVendedores = listaVendedores;
        vm.optImprimir = optImprimir;

        function accesoFiscal() {
            fiscalService
                    .isConnected()
                    .then(function (datos) {
                        if (datos) {
                            $scope.printer = true;
                        } else {
                            $scope.printer = false;
                        }
                    });
        }

        function confirmarImpresion(comprobanteFiscal, vendedorFiscal) {
            ngDialog.open({
                template: 'views/factura/fiscal/confirmar-impresion.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'FiscalController as vm',
                closeByDocument: false,
                closeByEscape: false,
                data: {
                    comprobanteFiscal: comprobanteFiscal,
                    vendedorFiscal: vendedorFiscal
                }
            });
        }

        function confirmarImpresionRegalo() {
            var serialRegalo = Math.floor((Math.random() * 99999) + 1000);
            facturaService
                    .searchById($stateParams.idFactura)
                    .then(function (datos) {
                        ngDialog.closeAll();
                        if (datos.status === 200 && datos.data.estado === 'CONFIRMADO') {
                            fiscalService
                                    .ticketOrRegalo($stateParams.idFactura, serialRegalo)
                                    .then(function (datos) {
                                        if (datos !== null) {
                                            facturaService
                                                    .searchById($stateParams.idFactura)
                                                    .then(function (datos) {
                                                        datos.data.regalo = serialRegalo;
                                                        facturaService
                                                                .update(datos.data)
                                                                .then(function (datos) {
                                                                    fiscalService.cleanFiles();
                                                                    if (datos.status === 200) {
                                                                        $rootScope.factura.regalo = serialRegalo;
                                                                        toaster.pop({
                                                                            type: 'success',
                                                                            title: 'Exito',
                                                                            body: 'Comprobante de regalo impreso.',
                                                                            showCloseButton: false
                                                                        });
                                                                    }
                                                                });
                                                    });
                                        } else {
                                            toaster.pop({
                                                type: 'error',
                                                title: 'Error',
                                                body: 'Comprobante no pudo ser impreso.',
                                                showCloseButton: false
                                            });
                                        }
                                    });
                        }
                    });
        }

        function finalizarComprobanteZ() {
            ngDialog.closeAll();
            fiscalService
                    .comprobanteZ()
                    .then(function (datos) {
                        if (datos) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Comprobante impreso con exito.',
                                showCloseButton: false
                            });
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error.',
                                body: 'No se ha podido imprimir el comprobante.',
                                showCloseButton: false
                            });
                        }
                    });
        }

        function imprimir(comprobanteFiscal, vendedorFiscal) {
            var control = 0;
            facturaService
                    .searchById($stateParams.idFactura)
                    .then(function (datos) {
                        var compare = datos.data;
                        var cliente = datos.data.cliente;
                        metodoPagoFacturaService
                                .getListaPagoFactura($stateParams.idFactura)
                                .then(function (datos) {
                                    var permiso = false;
                                    angular.forEach(datos.data, function (value, key) {
                                        control = control + parseFloat(value.montoPago);
                                    });
                                    if (control === compare.total) {
                                        switch (parseInt(comprobanteFiscal)) {
                                            case 1:
                                                permiso = true;
                                                break;
                                            case 3:
                                                if (cliente !== null) {
                                                    permiso = true;
                                                } else {
                                                    ngDialog.closeAll();
                                                    toaster.pop({
                                                        type: 'warning',
                                                        title: 'Advertencia',
                                                        body: '¡Debes añadir un cliente para imprimir!',
                                                        showCloseButton: false
                                                    });
                                                }
                                                break;
                                            case 4:
                                                if (cliente !== null) {
                                                    permiso = true;
                                                } else {
                                                    ngDialog.closeAll();
                                                    toaster.pop({
                                                        type: 'warning',
                                                        title: 'Advertencia',
                                                        body: '¡Debes añadir un cliente para imprimir!',
                                                        showCloseButton: false
                                                    });
                                                }
                                        }
                                        if (permiso) {
                                            $scope.$emit('imprimirComprobante', {vendedorFiscal, comprobanteFiscal});
                                        }
                                    } else {
                                        ngDialog.closeAll();
                                        toaster.pop({
                                            type: 'warning',
                                            title: 'Advertencia',
                                            body: '¡Aun hay saldo por pagar!',
                                            showCloseButton: false
                                        });
                                    }
                                });
                    });
        }

        function imprimirComprobanteZ() {
            ngDialog.open({
                template: 'views/factura/modal-comprobante-z.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'FiscalController as vm',
                closeByDocument: false,
                closeByEscape: true
            });
        }

        function imprimirTicketRegalo() {
            ngDialog.open({
                template: 'views/factura/fiscal/modal-ticket-regalo.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'FiscalController as vm',
                closeByDocument: false,
                closeByEscape: false
            });
        }

        function listaVendedores() {
            $scope.vendedores = "";
            facturaService
                    .getVendedores()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.vendedores = datos.data;
                        }
                    });
        }

        function optImprimir() {
            ngDialog.open({
                template: 'views/factura/fiscal/tipo-factura.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'FiscalController as vm',
                closeByDocument: false,
                closeByEscape: true
            });
        }

        $scope.$on('printState', function (obj, params) {
            console.log(params);
            if (params.status) {
                var numeracion = null;
                $scope.facturaImpresa = null;
                facturaService
                        .searchById($stateParams.idFactura)
                        .then(function (datos) {
                            console.log(datos);
                            if (datos.status === 200 && datos.data.numeracion === null) {
                                $scope.facturaImpresa = datos.data;
                                $scope.facturaImpresa.tipoFactura = params.tipo;
                                fiscalService
                                        .read()
                                        .then(function (datos) {
                                            console.log(datos);
                                            if (datos !== null) {
                                                var split = datos.split("|");
                                                numeracion = split[split.length - 1];
                                                $scope.facturaImpresa.numeracion = numeracion;
                                                $scope.facturaImpresa.estado = "CONFIRMADO";
                                                $scope.facturaImpresa.idVendedor = params.vendedorFiscal;
                                                var $update = facturaService.update($scope.facturaImpresa);
                                                $update.then(function (datos) {
                                                    ngDialog.closeAll();
                                                    if (datos.status === 200) {
                                                        toaster.pop({
                                                            type: 'success',
                                                            title: 'Exito',
                                                            body: 'Comprobante impreso.',
                                                            showCloseButton: false
                                                        });
                                                        $rootScope.factura = $scope.facturaImpresa;
                                                        fiscalService.cleanFiles();
                                                    }
                                                });
                                            }
                                        });
                            }
                        });
            } else {
                ngDialog.closeAll();
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Comprobante no puede ser impreso',
                    showCloseButton: false
                });
            }
        });

        $scope.$on('imprimirComprobante', function (obj, params) {
            $scope.facturaImpresa = null;
            var $factura = facturaService.searchById($stateParams.idFactura);
            $factura.then(function (datos) {
                if (datos.status === 200 && datos.data.numeracion === null) {
                    $scope.facturaImpresa = datos.data;
                    var $ticket;
                    switch (params.comprobanteFiscal) {
                        case 1:
                            $ticket = fiscalService.ticketOrRegalo($stateParams.idFactura, null);
                            break;
                        case 3:
                            fiscalService.factura_aOrFactura_b($stateParams.idFactura, datos.data.cliente.idCliente, 0);
                            break;
                        case 4:
                            console.log("B");
                            fiscalService.factura_aOrFactura_b($stateParams.idFactura, datos.data.cliente.idCliente, 1);
                            break;
                    }
                }
            });
        });

    }

})();