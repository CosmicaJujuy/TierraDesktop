/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('FiscalController', function (
        $scope,
        toaster,
        metodoPagoFacturaService,
        $rootScope,
        ngDialog,
        $stateParams,
        fiscalService,
        cookieService,
        facturaService) {

    $scope.comprobanteFiscal = null;
    $scope.vendedorFiscal = null;

    $scope.listaVendedores = function () {
        $scope.vendedores = "";
        $promesa = facturaService.getVendedores();
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                $scope.vendedores = datos.data;
            }
        });
    };

    $scope.accesoFiscal = function () {
        $scope.tk = cookieService.has('ptk');
        $scope.tk.then(function (datos) {
            if (!datos) {
                $printer = fiscalService.printer();
                $printer.then(function (datos) {
                    if (datos.status === 200) {
                        cookieService.put(datos.data.access_token, 'ptk');
                        $scope.printer = true;
                    } else {
                        $scope.printer = false;
                    }
                });
            } else {
                $scope.printer = true;
            }
        });
    };

    $scope.optImprimir = function () {
        ngDialog.open({
            template: 'views/factura/fiscal/tipo-factura.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'FiscalController',
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.confirmarImpresion = function (comprobanteFiscal, vendedorFiscal) {
        console.log(comprobanteFiscal, vendedorFiscal);
        ngDialog.open({
            template: 'views/factura/fiscal/confirmar-impresion.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'FiscalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {
                comprobanteFiscal: comprobanteFiscal,
                vendedorFiscal: vendedorFiscal
            }
        });
    };


    $scope.imprimir = function (comprobanteFiscal, vendedorFiscal) {
        var control = 0;
        var idFactura = $stateParams.idFactura;
        $factura = facturaService.searchById(idFactura);
        $factura.then(function (datos) {
            var compare = datos.data;
            var cliente = datos.data.cliente;
            $pago = metodoPagoFacturaService.getListaPagoFactura(idFactura);
            $pago.then(function (datos) {
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

    };

    $scope.$on('imprimirComprobante', function (obj, params) {
        ngDialog.closeAll();
        var numeracion = null;
        $scope.facturaImpresa = null;
        var idFactura = $stateParams.idFactura;
        $factura = facturaService.searchById(idFactura);
        $factura.then(function (datos) {
            if (datos.status === 200 && datos.data.numeracion === null) {
                $scope.facturaImpresa = datos.data;
                $detalles = facturaService.getDetalleFacturaList(idFactura);
                $detalles.then(function (datos) {
                    if (datos.status === 200) {
                        switch (params.comprobanteFiscal) {
                            case 1:
                                $ticket = fiscalService.ticket(datos.data);
                                $scope.facturaImpresa.tipoFactura = "ticket";
                                break;
                            case 3:
                                $ticket = fiscalService.factura_a(datos.data);
                                $scope.facturaImpresa.tipoFactura = "Factura A";
                                break;
                            case 4:
                                $ticket = fiscalService.factura_b(datos.data);
                                $scope.facturaImpresa.tipoFactura = "Factura B";
                                break;
                        }
                        $ticket.then(function (datos) {
                            var lastString = datos.data[datos.data.length - 1];
                            var split = lastString.split("|");
                            numeracion = split[split.length - 1];
                            $scope.facturaImpresa.numeracion = numeracion;
                            $scope.facturaImpresa.estado = "CONFIRMADO";
                            $scope.facturaImpresa.idVendedor = params.vendedorFiscal;
                            $update = facturaService.update($scope.facturaImpresa);
                            $update.then(function (datos) {
                                if (datos.status === 200) {
                                    toaster.pop({
                                        type: 'success',
                                        title: 'Exito',
                                        body: 'Comprobante impreso.',
                                        showCloseButton: false
                                    });
                                    $rootScope.factura = $scope.facturaImpresa;
                                }
                            });
                        });
                    }
                });
            }
        });
    });

    $scope.imprimirComprobanteZ = function () {
        ngDialog.open({
            template: 'views/factura/modal-comprobante-z.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'FiscalController',
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.finalizarComprobanteZ = function () {
        $comprobante = fiscalService.comprobanteZ();
        $comprobante.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
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
    };

});