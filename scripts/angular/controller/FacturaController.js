(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('FacturaController', FacturaController);

    FacturaController.$inject = ['$scope', 'BaseURL', '$mdDialog', 'cookieService', 'ngDialog', '$state', '$stateParams', 'clienteService', 'toaster', '$rootScope', 'NgTableParams', '_productoService', '$http', '$timeout', 'facturaService', 'metodoPagoFacturaService', 'medioPagoService', 'entidadBancariaService', 'planPagoService', 'tarjetaService'];

    function FacturaController($scope, BaseURL, $mdDialog, cookieService, ngDialog, $state, $stateParams, clienteService, toaster, $rootScope, NgTableParams, _productoService, $http, $timeout, facturaService, metodoPagoFacturaService, medioPagoService, entidadBancariaService, planPagoService, tarjetaService) {
        var vm = this;
        /*VARIABLS*/
        vm._newFactura = {
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
        vm.cargarMetodo = {
            montoPago: "",
            mediosPago: "",
            entidadPago: "",
            tarjetasPago: "",
            planPago: null,
            comprobantePago: ""
        };
        vm.clienteFactura = {
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
        $rootScope.factura = "";
        $scope.vendedor = "";
        vm.disableSelectEntidades = true;
        vm.disableSelectTarjeta = true;
        vm.disableSelectMetodo = true;
        vm.panelCliente = true;
        $scope.totalCompra = 0;
        $scope.totalPago = 0;
        /*METODOS*/
        vm.agregarCliente = agregarCliente;
        vm.agregarClienteDynamic = agregarClienteDynamic;
        vm.agregarFactura = agregarFactura;
        vm.agregarMetodoPago = agregarMetodoPago;
        vm.buscarCodigoBarra = buscarCodigoBarra;
        vm.busquedaPlanByTarjeta = busquedaPlanByTarjeta;
        vm.busquedaTarjeta = busquedaTarjeta;
        vm.cancelarFactura = cancelarFactura;
        vm.cargarDescuento = cargarDescuento;
        vm.cerrarFactura = cerrarFactura;
        vm.detailFactura = detailFactura;
        vm.efectivoHoy = efectivoHoy;
        vm.eliminarDescuento = eliminarDescuento;
        vm.eliminarDetalleFactura = eliminarDetalleFactura;
        vm.finalizarFacturados = finalizarFacturados;
        vm.getCliente = getCliente;
        vm.listaDetalleFactura = listaDetalleFactura;
        vm.listaEntidades = listaEntidades;
        vm.listaFacturas = listaFacturas;
        vm.listaFacturasDiaria = listaFacturasDiaria;
        vm.listaFacturasMensual = listaFacturasMensual;
        vm.listaFacturasMensualPaged = listaFacturasMensualPaged;
        vm.listaMedioPago = listaMedioPago;
        vm.listaMetodoPagoFactura = listaMetodoPagoFactura;
        vm.listaPlanesPago = listaPlanesPago;
        vm.listaTarjetas = listaTarjetas;
        vm.listaVendedores = listaVendedores;
        vm.metricas = metricas;

        function agregarCliente(cliente) {
            clienteService
                    .add(cliente)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Cliente agregado con exito.',
                                showCloseButton: false
                            });
                            cliente.idCliente = datos.data.msg;
                            $rootScope.factura.cliente = cliente;
                            facturaService
                                    .update($rootScope.factura)
                                    .then(function (datos) {
                                        if (datos.status === 200) {
                                            toaster.pop({
                                                type: 'success',
                                                title: 'Exito',
                                                body: 'Factura actualizada.',
                                                showCloseButton: false
                                            });
                                            $timeout(function timer() {
                                                vm.panelCliente = true;
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
        }

        function agregarClienteDynamic(cliente) {
            if (cliente !== null) {
                $rootScope.factura.cliente = cliente;
                facturaService
                        .update($rootScope.factura)
                        .then(function (datos) {
                            if (datos.status === 200) {
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
        }

        function agregarFactura(factura) {
            facturaService
                    .add(factura)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $state.transitionTo('factura', {idFactura: datos.data.msg});
                        }
                    });
        }

        function agregarMetodoPago(metodo) {
            facturaService
                    .searchById($stateParams.idFactura)
                    .then(function (datosf) {
                        metodoPagoFacturaService
                                .getListaPagoFactura($stateParams.idFactura)
                                .then(function (datos) {
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
        }

        function buscarCodigoBarra(codigo) {
            _productoService
                    .searchByBarcode(codigo)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Encontrado/s',
                                body: 'Se encontraron productos',
                                showCloseButton: false
                            });
                            $scope.stock = datos.data;
                            var initial = "";
                            vm.codigo = angular.copy(initial);
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
        }

        function busquedaPlanByTarjeta() {
            planPagoService
                    .searchByTarjeta(vm.cargarMetodo.tarjetasPago.idTarjeta)
                    .then(function (datos) {
                        $scope.planesPago = datos.data;
                        vm.disableSelectMetodo = false;
                    });
        }

        function busquedaTarjeta() {
            tarjetaService
                    .getEntidades(vm.cargarMetodo.entidadPago.idEntidadMonetaria, vm.cargarMetodo.mediosPago.idMedioPago)
                    .then(function (datos) {
                        vm.disableSelectTarjeta = false;
                        $scope.tarjetas = datos.data;
                    });
        }

        function cancelarFactura() {
            ngDialog.open({
                template: 'views/factura/modal-confirmar-cancelar-factura.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true
            });
        }

        function cargarDescuento(detalleFactura) {
            ngDialog.open({
                template: 'views/factura/modal-cargar-descuento.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalleFactura: detalleFactura}
            });
        }

        function cerrarFactura(ev) {
            var metodo = 0;
            metodoPagoFacturaService
                    .getListaPagoFactura($stateParams.idFactura)
                    .then(function (datos) {
                        angular.forEach(datos.data, function (value, key) {
                            metodo = parseFloat(metodo) + parseFloat(value.montoPago);
                        });
                        facturaService
                                .searchById($stateParams.idFactura)
                                .then(function (datos) {
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
        }

        function DialogController($scope, factura, facturaService) {
            $scope.facturaToUpdate = factura;
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };
            $scope.finalizarFactura = function () {
                $scope.facturaToUpdate.estado = 'CONFIRMADO';
                facturaService
                        .update($scope.facturaToUpdate)
                        .then(function (datos) {
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

        function detailFactura() {
            facturaService
                    .searchById($stateParams.idFactura)
                    .then(function (datos) {
                        $rootScope.factura = datos.data;
                    });
        }

        function efectivoHoy() {
            $scope.efectivo = 0;
            metodoPagoFacturaService
                    .getDay()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            angular.forEach(datos.data, function (value, key) {
                                if (value.planPago.idPlanesPago === 1) {
                                    $scope.efectivo = $scope.efectivo + parseFloat(value.montoPago);
                                }
                            });
                        }
                    });
        }

        function eliminarDescuento(detalleFactura) {
            ngDialog.open({
                template: 'views/factura/modal-eliminar-descuento.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalleFactura: detalleFactura}
            });
        }

        function eliminarDetalleFactura(detalleFactura) {
            ngDialog.open({
                template: 'views/factura/modal-eliminar-detalle.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalleFactura: detalleFactura}
            });
        }

        function finalizarFacturados() {
            if ($scope.vendedor !== "") {
                var metodo = 0;
                metodoPagoFacturaService
                        .getListaPagoFactura($stateParams.idFactura)
                        .then(function (datos) {
                            angular.forEach(datos.data, function (value, key) {
                                metodo = parseFloat(metodo) + parseFloat(value.montoPago);
                            });
                            facturaService
                                    .searchById($stateParams.idFactura)
                                    .then(function (datos) {
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
        }

        function getCliente(val) {
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
        }

        function listaDetalleFactura() {
            $scope.detalleFacturas = "";
            facturaService
                    .getDetalleFacturaList($stateParams.idFactura)
                    .then(function (datos) {
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
        }

        function listaEntidades() {
            entidadBancariaService
                    .getAll()
                    .then(function (datos) {
                        $scope.entidades = datos.data;
                    });
        }

        function listaFacturas() {
            $scope.facturas = "";
            facturaService
                    .getAll()
                    .then(function (datos) {
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
        }

        function listaFacturasDiaria() {
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
        }

        function listaFacturasMensual() {
            $scope.facturasMensual = "";
            facturaService
                    .getMonth()
                    .then(function (datos) {
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
        }

        function listaFacturasMensualPaged() {
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
        }

        function listaMedioPago() {
            medioPagoService
                    .getAll()
                    .then(function (datos) {
                        $scope.mediosPagos = datos.data;
                    });
        }

        function listaMetodoPagoFactura() {
            $scope.metodoPagos = "";
            metodoPagoFacturaService
                    .getListaPagoFactura($stateParams.idFactura)
                    .then(function (datos) {
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
        }

        function listaPlanesPago() {
            planPagoService
                    .getAll()
                    .then(function (datos) {
                        $scope.planesPago = datos.data;
                    });
        }

        function listaTarjetas() {
            tarjetaService
                    .getAll()
                    .then(function (datos) {
                        $scope.tarjetas = datos.data;
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

        function metricas() {
            facturaService
                    .metrics()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            vm.metrics = datos.data;
                        }
                    });
        }

        $scope.$on('reloadDetalles', function () {
            facturaService
                    .getDetalleFacturaList($stateParams.idFactura)
                    .then(function (datos) {
                        $scope.detalleFacturas = datos.data;
                        $scope.totalCompra = 0;
                        angular.forEach(datos.data, function (value, key) {
                            $scope.totalCompra = parseFloat($scope.totalCompra) + parseFloat(value.totalDetalle);
                        });
                        $scope.tableParams.reload();
                    });
        });

        $scope.$on('reloadMetodo', function () {
            metodoPagoFacturaService
                    .getListaPagoFactura($stateParams.idFactura)
                    .then(function (datos) {
                        var control = 0;
                        angular.forEach(datos.data, function (value, key) {
                            control = parseFloat(control) + parseFloat(value.montoPago);
                        });
                        vm.cargarMetodo = {
                            montoPago: "",
                            mediosPago: null,
                            entidadPago: "",
                            tarjetasPago: "",
                            planPago: null,
                            comprobantePago: ""
                        };
                        vm.disableSelectEntidades = true;
                        vm.disableSelectTarjeta = true;
                        vm.disableSelectMetodo = true;
                        $scope.totalPago = control;
                        $scope.metodoPagos = datos.data;
                        $scope.tableMetodos.reload();
                    });
        });

        $scope.$watch('vm.cargarMetodo.mediosPago', function (newValue, oldValue) {
            if ($state.current.name === 'factura' || $state.current.name === 'reserva') {
                if (newValue !== null || typeof newValue !== 'undefined') {
                    $scope.metodoPago.$setValidity();
                    $scope.metodoPago.$setPristine();
                    $scope.metodoPago.$setUntouched();
                    if (newValue.nombrePago === 'CONTADO') {
                        vm.disableSelectEntidades = true;
                        vm.disableSelectTarjeta = true;
                        vm.disableSelectMetodo = true;
                        vm.cargarMetodo.entidadPago = "";
                        vm.cargarMetodo.planPago = null;
                        vm.cargarMetodo.tarjetasPago = "";
                        vm.cargarMetodo.comprobantePago = "";
                    }
                    if (newValue.nombrePago === 'CREDITO' || newValue.nombrePago === 'DEBITO') {
                        vm.disableSelectEntidades = false;
                        vm.cargarMetodo.entidadPago = "";
                        vm.cargarMetodo.planPago = null;
                        vm.cargarMetodo.tarjetasPago = "";
                        vm.cargarMetodo.comprobantePago = "";
                    }
                    if (newValue.nombrePago === 'NOTA CREDITO') {
                        vm.cargarMetodo.planPago = true;
                    }
                }
            }
        });

        $scope.clock = "Cargando hora...";
        $scope.tick = function () {
            $scope.clock = Date.now();
            $timeout($scope.tick, 1000);
        };
        $timeout($scope.tick, 1000);

    }

})();