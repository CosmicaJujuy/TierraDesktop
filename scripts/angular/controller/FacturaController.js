/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('FacturaController', function (
        $scope,
        BaseURL,
        $mdDialog,
        cookieService,
        ngDialog, $state,
        $stateParams,
        clienteService,
        toaster,
        $rootScope,
        NgTableParams,
        _productoService,
        $http,
        $timeout,
        facturaService,
        metodoPagoFacturaService,
        medioPagoService,
        entidadBancariaService,
        planPagoService,
        tarjetaService) {

    $scope.oneAtATime = true;
    $scope.clientElement = {
        open: false
    };
    $scope.clientElementSearch = {
        open: false
    };

    $scope.clock = "Cargando hora..."; // initialise the time variable
    $scope.tickInterval = 1000; //ms    
    $scope.tick = function () {
        $scope.clock = Date.now(); // get the current time
        $timeout($scope.tick, $scope.tickInterval); // reset the timer
    };
    // Start the timer
    $timeout($scope.tick, $scope.tickInterval);


    $scope._newFactura = {
        "idFactura": null,
        "cliente": null,
        "estado": "INICIADO",
        "idVendedor": null,
        "fechaCreacion": null,
        "fechaModificacion": null,
        "usuarioCreacion": null,
        "usuarioModificacion": null,
        "total": null,
        "numeracion": null,
        "idSucursal": null
    };
    $rootScope.factura = "";

    $scope.barcode = "";
    $scope.vendedor = "";
    $scope.tipoFactura = "";

    $scope.cargarMetodo = {
        montoPago: "",
        mediosPago: null,
        entidadPago: "",
        tarjetasPago: "",
        planPago: null,
        comprobantePago: ""
    };

    $scope.totalCompra = 0;
    $scope.totalPago = 0;

    $scope.disableSelectEntidades = true;
    $scope.disableSelectTarjeta = true;
    $scope.disableSelectMetodo = true;

    $scope.clienteFactura = {
        documento: null,
        domicilio: null,
        emailCliente: null,
        fechaCreacion: null,
        fechaModificacion: null,
        fechaNacimiento: null,
        idCliente: null,
        nombreCliente: null,
        responsabilidadIva: null,
        telefono: null,
        tipoDocumento: null,
        usuarioCreacion: null,
        usuarioModificacion: null
    };

    $scope.agregarFactura = function (factura) {
        $promesa = facturaService.add(factura);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                $state.transitionTo('factura', {idFactura: datos.data.msg});
            }
        });
    };

    $scope.detailFactura = function () {
        var idFactura = $stateParams.idFactura;
        $promesa = facturaService.searchById(idFactura);
        $promesa.then(function (datos) {
            $rootScope.factura = datos.data;
        });
    };


    $scope.listaDetalleFactura = function () {
        var idFacturaDetalle = $stateParams.idFactura;
        $scope.detalleFacturas = "";
        $promesa = facturaService.getDetalleFacturaList(idFacturaDetalle);
        $promesa.then(function (datos) {
            $scope.detalleFacturas = datos.data;
            var data = datos.data;
            angular.forEach(data, function (value, key) {
                $scope.totalCompra = parseFloat($scope.totalCompra) + parseFloat(value.totalDetalle);
            });
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 5
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.detalleFacturas;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.$on('reloadDetalles', function () {
        var idFacturaDetalle = $stateParams.idFactura;
        facturaService.getDetalleFacturaList(idFacturaDetalle).then(function (datos) {
            $scope.detalleFacturas = datos.data;
            $scope.totalCompra = 0;
            angular.forEach(datos.data, function (value, key) {
                $scope.totalCompra = parseFloat($scope.totalCompra) + parseFloat(value.totalDetalle);
            });
            $scope.tableParams.reload();
        });
    });

    $scope.$on('reloadMetodo', function () {
        var idFactura = $stateParams.idFactura;
        $recharge = metodoPagoFacturaService.getListaPagoFactura(idFactura);
        $recharge.then(function (datos) {
            var control = 0;
            angular.forEach(datos.data, function (value, key) {
                control = parseFloat(control) + parseFloat(value.montoPago);
            });
            $scope.cargarMetodo = {
                montoPago: "",
                mediosPago: null,
                entidadPago: "",
                tarjetasPago: "",
                planPago: null,
                comprobantePago: ""
            };
            /*  $scope.metodoPago.$setValidity();
             $scope.metodoPago.$setPristine();
             $scope.metodoPago.$setUntouched();*/
            $scope.disableSelectEntidades = true;
            $scope.disableSelectTarjeta = true;
            $scope.disableSelectMetodo = true;
            $scope.totalPago = control;
            $scope.metodoPagos = datos.data;
            $scope.tableMetodos.reload();
        });
    });

    $scope.getCliente = function (val) {
        var uri = BaseURL + 'cliente/searchApellido';
        var token = cookieService.get('token');
        return token.then(function (data) {
            return $http({
                url: uri,
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + data
                },
                params: {
                    'apellidoCliente': val
                }
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        });
    };

    $scope.listaMetodoPagoFactura = function () {
        $scope.metodoPagos = "";
        var idFactura = $stateParams.idFactura;
        $promesa = metodoPagoFacturaService.getListaPagoFactura(idFactura);
        $promesa.then(function (datos) {
            $scope.metodoPagos = datos.data;
            var data = datos.data;
            angular.forEach(datos.data, function (value, key) {
                $scope.totalPago = parseFloat($scope.totalPago) + parseFloat(value.montoPago);
            });
            $scope.tableMetodos = new NgTableParams({
                page: 1,
                count: 5
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.metodoPagos;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };


    /**
     * Modulo carga metodo de pago, correspondientes listados
     * @returns {undefined}
     */
    $scope.listaMedioPago = function () {
        $promesa = medioPagoService.getAll();
        $promesa.then(function (datos) {
            $scope.mediosPagos = datos.data;
        });
    };
    $scope.listaEntidades = function () {
        $promesa = entidadBancariaService.getAll();
        $promesa.then(function (datos) {
            $scope.entidades = datos.data;
        });
    };
    $scope.listaPlanesPago = function () {
        $promesa = planPagoService.getAll();
        $promesa.then(function (datos) {
            $scope.planesPago = datos.data;
        });
    };
    $scope.listaTarjetas = function () {
        $promesa = tarjetaService.getAll();
        $promesa.then(function (datos) {
            $scope.tarjetas = datos.data;
        });
    };

    $scope.$watch('cargarMetodo.mediosPago', function (newValue, oldValue) {
        if (newValue !== null) {
            $scope.metodoPago.$setValidity();
            $scope.metodoPago.$setPristine();
            $scope.metodoPago.$setUntouched();
            if (newValue.nombrePago === 'CONTADO') {
                $scope.disableSelectEntidades = true;
                $scope.disableSelectTarjeta = true;
                $scope.disableSelectMetodo = true;
                $scope.cargarMetodo.entidadPago = "";
                $scope.cargarMetodo.planPago = null;
                $scope.cargarMetodo.tarjetasPago = "";
                $scope.cargarMetodo.comprobantePago = "";
            }
            if (newValue.nombrePago === 'CREDITO' || newValue.nombrePago === 'DEBITO') {
                $scope.disableSelectEntidades = false;
                $scope.cargarMetodo.entidadPago = "";
                $scope.cargarMetodo.planPago = null;
                $scope.cargarMetodo.tarjetasPago = "";
                $scope.cargarMetodo.comprobantePago = "";
            }
            if (newValue.nombrePago === 'NOTA CREDITO') {
                $scope.cargarMetodo.planPago = true;
            }
        }
    });

    $scope.busquedaTarjeta = function () {
        $promesa = tarjetaService.getEntidades($scope.cargarMetodo.entidadPago.idEntidadMonetaria, $scope.cargarMetodo.mediosPago.idMedioPago);
        $promesa.then(function (datos) {
            $scope.disableSelectTarjeta = false;
            $scope.tarjetas = datos.data;
        });
    };

    $scope.busquedaPlanByTarjeta = function () {
        $promesa = planPagoService.searchByTarjeta($scope.cargarMetodo.tarjetasPago.idTarjeta);
        $promesa.then(function (datos) {
            $scope.planesPago = datos.data;
            $scope.disableSelectMetodo = false;
        });
    };

    $scope.agregarMetodoPago = function (metodo) {
        $promesa = facturaService.searchById($stateParams.idFactura);
        $promesa.then(function (datosf) {
            $metodo = metodoPagoFacturaService.getListaPagoFactura($stateParams.idFactura);
            $metodo.then(function (datos) {
                $scope.totalReserva = 0;
                angular.forEach(datos.data, function (value, key) {
                    $scope.totalReserva = parseFloat($scope.totalReserva) + parseFloat(value.montoPago);
                });
                var compare = parseFloat($scope.totalReserva) + parseFloat(metodo.montoPago);
                if (datosf.data.total >= compare && metodo.mediosPago !== null) {
                    if ((metodo.mediosPago.idMedioPago !== 1 && metodo.comprobantePago !== "")
                            || (metodo.mediosPago.idMedioPago === 1)) {
                        ngDialog.open({
                            template: 'views/factura/modal-confirmar-agregar-metodo-pago.html',
                            className: 'ngdialog-theme-sm',
                            showClose: false,
                            controller: 'ModalController',
                            closeByDocument: false,
                            closeByEscape: true,
                            data: {metodo: metodo, factura: datosf.data}
                        });
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'Revisa las opciones de pago de nuevo.',
                            showCloseButton: false
                        });
                    }
                } else {
                    if (metodo.mediosPago === null) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'El medio de pago no puede estar vacio.',
                            showCloseButton: false
                        });
                    }
                    if (isNaN(compare)) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'El monto no puede estar vacio.',
                            showCloseButton: false
                        });
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'El monto supera el total de la factura.',
                            showCloseButton: false
                        });
                    }
                }
            });
        });
    };

    $scope.panelCliente = true;
    $scope.agregarCliente = function (cliente) {
        $addCliente = clienteService.add(cliente);
        $addCliente.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Cliente agregado con exito.',
                    showCloseButton: false
                });
                cliente.idCliente = datos.data.msg;
                $rootScope.factura.cliente = cliente;
                $promesa = facturaService.update($rootScope.factura);
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Factura actualizada.',
                            showCloseButton: false
                        });
                        $timeout(function timer() {
                            $scope.panelCliente = true;
                        }, 2000);
                    }
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'El cliente no pudo ser agregado',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.agregarClienteDynamic = function (cliente) {
        if (cliente !== null) {
            $rootScope.factura.cliente = cliente;
            $promesa = facturaService.update($rootScope.factura);
            $promesa.then(function (datos) {
                if (datos.status === 200) {
                    $scope.clientElementSearch.open = !$scope.clientElementSearch.open;
                    toaster.pop({
                        type: 'success',
                        title: 'Exito',
                        body: 'Factura actualizada.',
                        showCloseButton: false
                    });
                } else {
                    toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: 'Error, la factura no pudo ser actualizada',
                        showCloseButton: false
                    });
                }
            });
        } else {
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: 'El cliente no debe estar vacio.',
                showCloseButton: false
            });
        }
    };

    /*listdos de las tabs */

    $scope.listaFacturas = function () {
        $scope.facturas = "";
        $promesa = facturaService.getAll();
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                $scope.totalFacturas = 0;
                angular.forEach(datos.data, function (value, key) {
                    if (value.estado === 'CONFIRMADO') {
                        $scope.totalFacturas = parseFloat($scope.totalFacturas) + parseFloat(value.total);
                    }
                });
                $scope.facturas = datos.data;
                var data = datos.data;
                $scope.tableFacturas = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.facturas;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.listaFacturasDiaria = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableFacturasDiaria = new NgTableParams({
                page: 1,
                count: 12
            }, {
                getData: function (params) {
                    return $http({
                        url: BaseURL + "factura/day/paged",
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer ' + data,
                            'Content-type': 'application/json'
                        },
                        params: {
                            page: params.page() - 1,
                            size: params.count()
                        }
                    }).then(function successCallback(response) {
                        params.total(response.data.totalElements);
                        return response.data.content;
                    }, function errorCallback(response) {
                    });
                }
            });
        });
    };

    $scope.listaFacturasMensual = function () {
        $scope.facturasMensual = "";
        $mes = facturaService.getMonth();
        $mes.then(function (datos) {
            if (datos.status === 200) {
                $scope.facturasMensual = datos.data;
                var data = datos.data;
                $scope.tableFacturasMensual = new NgTableParams({
                    page: 1,
                    count: 13
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.facturasMensual;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.listaVendedores = function () {
        $scope.vendedores = "";
        $promesa = facturaService.getVendedores();
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                $scope.vendedores = datos.data;
            }
        });
    };

    $scope.cerrarFactura = function (ev) {
        var metodo = 0;
        $metodo = metodoPagoFacturaService.getListaPagoFactura($stateParams.idFactura);
        $metodo.then(function (datos) {
            angular.forEach(datos.data, function (value, key) {
                metodo = parseFloat(metodo) + parseFloat(value.montoPago);
            });
            $promesa = facturaService.searchById($stateParams.idFactura);
            $promesa.then(function (datos) {
                if (datos.data.total === metodo && datos.data.total !== 0) {
                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'views/factura/modal-cerrar-factura.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        escapeToClose: true,
                        locals: {factura: datos.data}
                    });
                    function DialogController($scope, factura, facturaService) {
                        $scope.facturaToUpdate = factura;
                        $scope.closeDialog = function () {
                            $mdDialog.hide();
                        };
                        $scope.finalizarFactura = function () {
                            $scope.facturaToUpdate.estado = 'CONFIRMADO';
                            $update = facturaService.update($scope.facturaToUpdate);
                            $update.then(function (datos) {
                                if (datos.status === 200) {
                                    $mdDialog.hide();
                                    $state.transitionTo('facturas');
                                } else {
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Error',
                                        body: "¡Op's algo paso!, comunicate con el administrador.",
                                        showCloseButton: false
                                    });
                                }
                            });
                        };
                    }
                } else {
                    if (datos.data.total === 0) {
                        toaster.pop({
                            type: 'warning',
                            title: 'Advertencia',
                            body: "Advertencia', 'El monto no puede ser cero.",
                            showCloseButton: false
                        });
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'Aun queda saldo por pagar.',
                            showCloseButton: false
                        });
                    }
                }
            });
        });
    };

    $scope.finalizarFacturados = function () {
        var idFactura = $stateParams.idFactura;
        if ($scope.vendedor !== "") {
            var metodo = 0;
            $metodo = metodoPagoFacturaService.getListaPagoFactura(idFactura);
            $metodo.then(function (datos) {
                angular.forEach(datos.data, function (value, key) {
                    metodo = parseFloat(metodo) + parseFloat(value.montoPago);
                });
                $promesa = facturaService.searchById(idFactura);
                $promesa.then(function (datos) {
                    if (datos.data.total === metodo && datos.data.total !== 0) {
                        $rootScope.factura.idVendedor = $scope.vendedor;
                        $rootScope.factura.estado = 'CONFIRMADO';

                    } else {

                    }
                });
            });
        } else {
            toaster.pop({
                type: 'warning',
                title: 'Advertencia',
                body: 'Por favor elige un vendedor',
                showCloseButton: false
            });
        }
    };

    $scope.buscarCodigoBarra = function (codigo) {
        $listBarcode = _productoService.searchByBarcode(codigo);
        $listBarcode.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Encontrado/s',
                    body: 'Se encontraron productos',
                    showCloseButton: false
                });
                $scope.stock = datos.data;
                var initial = "";
                $scope.codigo = angular.copy(initial);
                $scope.codigoBarras.$setPristine();
                $scope.codigoBarras.$setValidity();
                $scope.codigoBarras.$setUntouched();
                ngDialog.open({
                    template: 'views/factura/modal-buscar-codigo-barra.html',
                    className: 'ngdialog-theme-lg ngdialog-theme-custom',
                    showClose: false,
                    controller: 'ModalController',
                    closeByDocument: false,
                    closeByEscape: true,
                    data: {
                        stock: $scope.stock
                    }
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'No se han encontrado productos',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.cargarDescuento = function (detalleFactura) {
        ngDialog.open({
            template: 'views/factura/modal-cargar-descuento.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {detalleFactura: detalleFactura}
        });
    };

    $scope.eliminarDescuento = function (detalleFactura) {
        ngDialog.open({
            template: 'views/factura/modal-eliminar-descuento.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {detalleFactura: detalleFactura}
        });
    };

    $scope.eliminarDetalleFactura = function (detalleFactura) {
        ngDialog.open({
            template: 'views/factura/modal-eliminar-detalle.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {detalleFactura: detalleFactura}
        });
    };

    $scope.efectivoHoy = function () {
        $scope.efectivo = 0;
        $efectivo = metodoPagoFacturaService.getDay();
        $efectivo.then(function (datos) {
            if (datos.status === 200) {
                angular.forEach(datos.data, function (value, key) {
                    if (value.planPago.idPlanesPago === 1) {
                        $scope.efectivo = $scope.efectivo + parseFloat(value.montoPago);
                    }
                });
            }
        });
    };

    $scope.cancelarFactura = function () {
        ngDialog.open({
            template: 'views/factura/modal-confirmar-cancelar-factura.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true
        });
    };

    $scope.listaFacturasMensualPaged = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableFacturasMensualPaged = new NgTableParams({
                page: 1,
                count: 12
            }, {
                getData: function (params) {
                    return $http({
                        url: BaseURL + "factura/month/paged",
                        method: 'get',
                        headers: {
                            'Authorization': 'Bearer ' + data,
                            'Content-type': 'application/json'
                        },
                        params: {
                            page: params.page() - 1,
                            size: params.count()
                        }
                    }).then(function successCallback(response) {
                        params.total(response.data.totalElements);
                        return response.data.content;
                    }, function errorCallback(response) {
                    });
                }
            });
        });
    };

    $scope.metricas = function () {
        $sum = facturaService.metrics();
        $sum.then(function (datos) {
            if (datos.status === 200) {
                $scope.metrics = datos.data;
            }
        });
    };

});

