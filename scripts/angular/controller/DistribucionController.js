(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('DistribucionController', DistribucionController);

    DistribucionController.$inject = ['$scope', '$http', 'BaseURL', 'cookieService', '$rootScope', '_productoService', 'NgTableParams', 'ngDialog', 'toaster', 'facturaProductoService', '$state', '$stateParams', 'distribucionService'];

    function DistribucionController($scope, $http, BaseURL, cookieService, $rootScope, _productoService, NgTableParams, ngDialog, toaster, facturaProductoService, $state, $stateParams, distribucionService) {
        var vm = this;
        /*VARIABLES*/
        vm.modalDistribuir = {
            tierra: null,
            bebelandia: null,
            libertador: null
        };
        vm.wrapper = {
            "stockTierra": {
                "idStock": null,
                "cantidad": null,
                "idProducto": null,
                "estado": true,
                "usuarioCreacion": null,
                "usuarioModificacion": null,
                "fechaCreacion": null,
                "fechaModificacion": null,
                "idSucursal": null
            },
            "stockBebelandia": {
                "idStock": null,
                "cantidad": null,
                "idProducto": null,
                "estado": true,
                "usuarioCreacion": null,
                "usuarioModificacion": null,
                "fechaCreacion": null,
                "fechaModificacion": null,
                "idSucursal": null
            },
            "stockLibertador": {
                "idStock": null,
                "cantidad": null,
                "idProducto": null,
                "estado": true,
                "usuarioCreacion": null,
                "usuarioModificacion": null,
                "fechaCreacion": null,
                "fechaModificacion": null,
                "idSucursal": null
            }
        };
        /*METODOS*/
        vm.confirmarDistribuir = confirmarDistribuir;
        vm.confirmarFinalizarDistribucion = confirmarFinalizarDistribucion;
        vm.detallesFacturaProductoDistribucion = detallesFacturaProductoDistribucion;
        vm.distribuirModal = distribuirModal;
        vm.finalizarEstadoDistribucion = finalizarEstadoDistribucion;
        vm.finalizarDistribucion = finalizarDistribucion;
        vm.listaBebelandia = listaBebelandia;
        vm.listaFacturaBebelandia = listaFacturaBebelandia;
        vm.listaFacturaLibertador = listaFacturaLibertador;
        vm.listaFacturaTierra = listaFacturaTierra;
        vm.listaLibertador = listaLibertador;
        vm.listaTierra = listaTierra;
        vm.verificarDistribucion = verificarDistribucion;

        function confirmarDistribuir(modalDistribuir) {
            var control = 0;
            control = modalDistribuir.tierra + modalDistribuir.bebelandia + modalDistribuir.libertador;
            if (control === $rootScope.modalProducto.cantidadTotal) {
                if (modalDistribuir.tierra !== null) {
                    vm.wrapper.stockTierra.idProducto = $rootScope.modalProducto;
                    vm.wrapper.stockTierra.cantidad = modalDistribuir.tierra;
                }
                if (modalDistribuir.bebelandia !== null) {
                    vm.wrapper.stockBebelandia.idProducto = $rootScope.modalProducto;
                    vm.wrapper.stockBebelandia.cantidad = modalDistribuir.bebelandia;
                }
                if (modalDistribuir.libertador !== null) {
                    vm.wrapper.stockLibertador.idProducto = $rootScope.modalProducto;
                    vm.wrapper.stockLibertador.cantidad = modalDistribuir.libertador;
                }
                ngDialog.open({
                    template: 'views/distribucion/modal-confirmacion-distribuir.html',
                    className: 'ngdialog-theme-advertencia',
                    showClose: false,
                    controller: 'DistribucionController as vm',
                    closeByDocument: false,
                    closeByEscape: true,
                    data: {
                        'wrapper': vm.wrapper,
                        'producto': $rootScope.modalProducto
                    }
                });
            } else {
                toaster.pop({
                    type: 'warning',
                    title: '¡Atention!',
                    body: 'La cantidad total de productos a distribuir debe ser igual a la cantidad total de productos en almacen.',
                    showCloseButton: false
                });
            }
        }

        function confirmarFinalizarDistribucion(detalle) {
            ngDialog.open({
                template: 'views/distribucion/modal-confirmar-finalizar.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'DistribucionController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {'detalle': detalle}
            });
        }

        function detallesFacturaProductoDistribucion() {
            facturaProductoService
                    .detail($stateParams.idFactura)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.detalle = datos.data;
                        }
                    });
        }

        function distribuirModal(producto) {
            $rootScope.modalProducto = producto;
            ngDialog.open({
                template: 'views/distribucion/modal-distribuir-stock.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'DistribucionController as vm',
                closeByDocument: false,
                closeByEscape: true
            });
        }

        function finalizarDistribucion() {
            $scope.sendWrapper = {
                stockTierra: null,
                stockBebelandia: null,
                stockLibertador: null
            };
            if ($scope.ngDialogData.wrapper.stockTierra.idProducto !== null && $scope.ngDialogData.wrapper.stockTierra.cantidad) {
                $scope.sendWrapper.stockTierra = $scope.ngDialogData.wrapper.stockTierra;
            }
            if ($scope.ngDialogData.wrapper.stockBebelandia.idProducto !== null && $scope.ngDialogData.wrapper.stockBebelandia.cantidad) {
                $scope.sendWrapper.stockBebelandia = $scope.ngDialogData.wrapper.stockBebelandia;
            }
            if ($scope.ngDialogData.wrapper.stockLibertador.idProducto !== null && $scope.ngDialogData.wrapper.stockLibertador.cantidad) {
                $scope.sendWrapper.stockLibertador = $scope.ngDialogData.wrapper.stockLibertador;
            }
            distribucionService
                    .add($scope.sendWrapper)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            ngDialog.closeAll();
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Se ha distribuido con exito los productos.',
                                showCloseButton: false
                            });
                        }
                    });
            $scope.$emit('updateTables', $scope.ngDialogData.producto);
        }

        function finalizarEstadoDistribucion() {
            $scope.ngDialogData.detalle.estadoLocal = "REPARTIDO";
            facturaProductoService
                    .update($scope.ngDialogData.detalle)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            ngDialog.closeAll();
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'El estado de la factura se modifico correctamente.',
                                showCloseButton: false
                            });
                        }
                    });
        }

        function listaBebelandia() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableBebelandiaStock = new NgTableParams({
                    page: 1,
                    count: 11
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "stock/list/paged",
                            method: 'get',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                idStock: 2,
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

        function listaFacturaBebelandia() {
            distribucionService
                    .getStockBebelandia($stateParams.idFactura)
                    .then(function (datos) {
                        var data = datos.data;
                        $scope.facturaBebelandia = datos.data;
                        $scope.tableFacturaBebelandia = new NgTableParams({
                            page: 1,
                            count: 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.facturaBebelandia;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }});
                    });
        }

        function listaFacturaLibertador() {
            distribucionService
                    .getStockLibertador($stateParams.idFactura)
                    .then(function (datos) {
                        var data = datos.data;
                        $scope.facturaLibertador = datos.data;
                        $scope.tableFacturaLibertador = new NgTableParams({
                            page: 1,
                            count: 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.facturaLibertador;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }});
                    });
        }

        function listaFacturaTierra() {
            distribucionService
                    .getStockTierra($stateParams.idFactura)
                    .then(function (datos) {
                        $scope.facturaTierra = datos.data;
                        var data = datos;
                        $scope.tableFacturaTierra = new NgTableParams({
                            page: 1,
                            count: 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.facturaTierra;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }});
                    });
        }

        function listaLibertador() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableLibertadorStock = new NgTableParams({
                    page: 1,
                    count: 11
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "stock/list/paged",
                            method: 'get',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                idStock: 3,
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

        function listaTierra() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableTierraStock = new NgTableParams({
                    page: 1,
                    count: 11
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "stock/list/paged",
                            method: 'get',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                idStock: 1,
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

        $scope.$on('updateStock', function (event, object) {
            distribucionService
                    .getStockTierra($stateParams.idFactura)
                    .then(function (datos) {
                        $scope.facturaTierra = datos.data;
                        $scope.tableFacturaTierra.reload();
                    });
            distribucionService
                    .getStockBebelandia($stateParams.idFactura)
                    .then(function (datos) {
                        $scope.facturaBebelandia = datos.data;
                        $scope.tableFacturaBebelandia.reload();
                    });
            distribucionService
                    .getStockLibertador($stateParams.idFactura)
                    .then(function (datos) {
                        $scope.facturaLibertador = datos.data;
                        $scope.tableFacturaLibertador.reload();
                    });
        });

        $scope.$on('updateTables', function (event, object) {
            object.estadoDistribucion = true;
            _productoService
                    .update(object)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $rootScope.$broadcast('updateTableProducto', {'idFactura': $stateParams.idFactura});
                        }
                    });
        });

        function verificarDistribucion(facturaProducto) {
            if (facturaProducto.carga === true) {
                ngDialog.open({
                    template: 'views/distribucion/modal-advertencia-distribuir.html',
                    scope: $scope,
                    className: 'ngdialog-theme-advertencia',
                    showClose: false,
                    controller: 'DistribucionController',
                    closeByDocument: false,
                    closeByEscape: true
                });
            } else {
                $state.go('distribuir_productos', {idFactura: facturaProducto.idFacturaProducto});
            }
        }

    }

})();