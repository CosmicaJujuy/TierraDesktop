/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('FacturaController',
        ['$scope', 'cookieService', 'ngDialog', '$state', '$stateParams', 'clienteService', 'toaster', '$rootScope', 'NgTableParams', '_productoService', '$http', '$timeout', '$uibModal', '$cookies', 'facturaService', 'metodoPagoFacturaService', 'medioPagoService', 'entidadBancariaService', 'planPagoService', 'tarjetaService',
            function ($scope, cookieService, ngDialog, $state, $stateParams, clienteService, toaster, $rootScope, NgTableParams, _productoService, $http, $timeout, $uibModal, $cookies, facturaService, metodoPagoFacturaService, medioPagoService, entidadBancariaService, planPagoService, tarjetaService) {

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
                $scope._metodoPago = {
                    "idMetodoPagoFactura": null,
                    "planPago": null,
                    "factura": null,
                    "montoPago": null,
                    "estado": true,
                    "fechaCreacion": null,
                    "fechaModificacion": null,
                    "usuarioCreacion": null,
                    "usuarioModificacion": null
                };

                $scope.barcode = "";
                $scope.vendedor = "";
                $scope.tipoFactura = "";
                $scope.montoPago = "";
                $scope.totalCompra = 0;
                $scope.totalPago = 0;
                $scope.entidadPago = "";
                $scope.planPago = null;
                $scope.comprobantePago = "";
                $scope.tarjetasPago = "";
                $scope.mediosPago = null;
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

                $scope.open = function (barcode) {
                    $rootScope.productosBarcode = "";
                    var control = barcode.length;
                    if (control >= 9) {
                        $promesa = _productoService.searchByBarcode(barcode);
                        $promesa.then(function (datos) {
                            $rootScope.productosBarcode = datos.data;
                        });
                        $timeout(function timer() {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'searchResultados.html',
                                controller: 'ModalController',
                                size: 'lg',
                                resolve: {}
                            });
                        }, 2000);
                    }
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

                $rootScope.$on('reloadMetodo', function () {
                    var idFactura = $stateParams.idFactura;
                    $recharge = metodoPagoFacturaService.getListaPagoFactura(idFactura);
                    $recharge.then(function (datos) {
                        var control = 0;
                        angular.forEach(datos.data, function (value, key) {
                            control = parseFloat(control) + parseFloat(value.montoPago);
                        });
                        $scope.montoPago = "";
                        $scope.planPago = null;
                        $scope.tarjetasPago = "";
                        $scope.entidadPago = "";
                        $scope.mediosPago = null;
                        $scope.comprobantePago = "";
                        $scope.disableSelectEntidades = true;
                        $scope.disableSelectTarjeta = true;
                        $scope.disableSelectMetodo = true;
                        $scope.totalPago = control;
                        $scope.metodoPagos = datos.data;
                        $scope.tableMetodos.reload();
                    });
                });

                $scope.getCliente = function (val) {
                    var uri = 'https://tierradecoloresapi.herokuapp.com/cliente/searchApellido';
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

                $scope.$watch('mediosPago', function (newValue, oldValue) {
                    if (newValue !== null) {
                        if (newValue.nombrePago === 'CONTADO') {
                            $scope.disableSelectEntidades = true;
                            $scope.disableSelectTarjeta = true;
                            $scope.disableSelectMetodo = true;
                            $scope.entidadPago = "";
                            $scope.planPago = "";
                            $scope.tarjetasPago = "";
                        }
                        if (newValue.nombrePago === 'CREDITO' || newValue.nombrePago === 'DEBITO') {
                            $scope.disableSelectEntidades = false;

                        }
                    }
                });

                $scope.busquedaTarjeta = function () {
                    $promesa = tarjetaService.getEntidades($scope.entidadPago.idEntidadMonetaria, $scope.mediosPago.idMedioPago);
                    $promesa.then(function (datos) {
                        $scope.disableSelectTarjeta = false;
                        $scope.tarjetas = datos.data;
                    });
                };

                $scope.busquedaPlanByTarjeta = function () {
                    $promesa = planPagoService.searchByTarjeta($scope.tarjetasPago.idTarjeta);
                    $promesa.then(function (datos) {
                        $scope.planesPago = datos.data;
                        $scope.disableSelectMetodo = false;
                    });
                };

                $scope.seleccionarMetodoPago = function (montoPago, mediosPago, entidadPago, tarjetasPago, planPago, comprobantePago) {
                    $rootScope.metodo = {
                        'montoPago': montoPago,
                        'mediosPago': mediosPago,
                        'entidadPago': entidadPago,
                        'tarjetasPago': tarjetasPago,
                        'planPago': planPago,
                        'comprobantePago': comprobantePago
                    };
                };

                $scope.agregarMetodoPago = function () {
                    var idFactura = $stateParams.idFactura;
                    $promesa = facturaService.searchById(idFactura);
                    $promesa.then(function (datos) {
                        /* suma monto a pagar y total para controlar que no exceda a la factura*/
                        var compare = parseFloat($scope.totalPago) + parseFloat($rootScope.metodo.montoPago);
                        console.log(compare);
                        console.log(datos.data.total);
                        if (datos.data.total >= compare) {
                            $scope._metodoPago.factura = datos.data;
                            /* control para separar pago contado y otros metodos*/
                            if ($rootScope.metodo.mediosPago.idMedioPago !== 1) {
                                $scope._metodoPago.planPago = $rootScope.metodo.planPago;
                            } else {
                                $scope._metodoPago.planPago = null;
                            }
                            /* control para evitar monto vacio*/
                            if ($rootScope.metodo.montoPago === "") {
                                toaster.pop({
                                    type: 'warning',
                                    title: 'Advertencia',
                                    body: 'El monto a pagar no puede estar vacio.',
                                    showCloseButton: false
                                });
                            } else {
                                $scope._metodoPago.montoPago = $rootScope.metodo.montoPago;
                                /* control para evitar comprobante de pago vacio*/
                                if ($rootScope.metodo.comprobantePago === "" && $rootScope.metodo.mediosPago.idMedioPago !== 1) {
                                    toaster.pop('warning', 'Advertencia', 'El comprobante no puede estar vacio.');
                                    toaster.pop({
                                        type: 'warning',
                                        title: 'Advertencia',
                                        body: 'El comprobante no puede estar vacio.',
                                        showCloseButton: false
                                    });
                                } else {
                                    $scope._metodoPago.comprobante = $rootScope.metodo.comprobantePago;
                                    $prom = metodoPagoFacturaService.addMetodoPago($scope._metodoPago);
                                    $prom.then(function (datos) {
                                        console.log(datos);
                                        if (datos.status === 200) {
                                            $timeout(function timer() {
                                                toaster.pop({
                                                    type: 'success',
                                                    title: 'Exito',
                                                    body: 'Metodo de pago agregado.',
                                                    showCloseButton: false
                                                });
                                            }, 1000);
                                            $rootScope.$emit('reloadMetodo', {});
                                        } else {
                                            if (datos.status === 400) {
                                                $timeout(function timer() {
                                                    toaster.pop({
                                                        type: 'warning',
                                                        title: 'Advertencia',
                                                        body: 'El monto de pago supera al saldo',
                                                        showCloseButton: false
                                                    });
                                                }, 1000);
                                            }
                                        }
                                    }).catch(function (fallback) {
                                        toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: '¡Ops Algo paso!',
                                            showCloseButton: false
                                        });
                                    });
                                }
                            }
                        } else {
                            /* control para diferenciar monto vacio*/
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
                };

                $scope.agregarCliente = function (cliente) {
                    console.log(cliente);
                    $addCliente = clienteService.add(cliente);
                    $addCliente.then(function (datos) {
                        console.log(datos);
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
                                        $scope.clientElement.open = !$scope.clientElement.open;
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
                    $scope.facturaDiarias = "";
                    $rootScope.factConf = 0;
                    $rootScope.impresasHoy = 0;
                    $promesa = facturaService.getDay();
                    $promesa.then(function (datos) {
                        if (datos.status === 200) {
                            $scope.totalFacturasDiaria = 0;
                            angular.forEach(datos.data, function (value, key) {
                                if (value.estado === 'CONFIRMADO') {
                                    $scope.totalFacturasDiaria = parseFloat($scope.totalFacturasDiaria) + parseFloat(value.total);
                                    $rootScope.factConf = $rootScope.factConf + 1;
                                    if (value.numeracion !== null) {
                                        $rootScope.impresasHoy = $rootScope.impresasHoy + parseFloat(value.total);
                                    }
                                }
                            });
                            $scope.facturaDiarias = datos.data;
                            var data = datos.data;
                            $scope.tableFacturasDiaria = new NgTableParams({
                                page: 1,
                                count: 10
                            }, {
                                total: data.length,
                                getData: function (params) {
                                    data = $scope.facturaDiarias;
                                    params.total(data.length);
                                    if (params.total() <= ((params.page() - 1) * params.count())) {
                                        params.page(1);
                                    }
                                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                }});
                        }
                    });
                };

                $scope.listaFacturasMensual = function () {
                    $scope.facturasMensual = "";
                    $mes = facturaService.getMonth();
                    $mes.then(function (datos) {
                        if (datos.status === 200) {
                            $scope.totalFacturasMensual = 0;
                            angular.forEach(datos.data, function (value, key) {
                                if (value.estado === 'CONFIRMADO') {
                                    $scope.totalFacturasMensual = parseFloat($scope.totalFacturasMensual) + parseFloat(value.total);
                                }
                            });
                            $scope.facturasMensual = datos.data;
                            var data = datos.data;
                            $scope.tableFacturasMensual = new NgTableParams({
                                page: 1,
                                count: 10
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

                $scope.finalizarFactura = function () {
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
                                    $update = facturaService.update($rootScope.factura);
                                    $update.then(function (datos) {
                                        if (datos.status === 200) {
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
                                closeByEscape: false,
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
                        closeByEscape: false,
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
                        closeByEscape: false,
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
                        closeByEscape: false,
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


            }]);

