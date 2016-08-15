/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('DistribucionController', function (
        $scope,
        $http,
        BaseURL,
        cookieService,
        $rootScope,
        _productoService,
        NgTableParams,
        ngDialog,
        toaster,
        $timeout,
        facturaProductoService,
        $state,
        $stateParams,
        distribucionService) {

    $scope.alerts = [];
    $scope.modalDistribuir = {
        tierra: null,
        bebelandia: null,
        libertador: null
    };
    $scope.wrapper = {
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
        }};

    $scope.detallesFacturaProductoDistribucion = function () {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $detail = facturaProductoService.detail(idFacturaProducto);
        $detail.then(function (datos) {
            if (datos.status === 200) {
                $scope.detalle = datos.data;
            }
        });
    };

    $scope.listaTierraDEPRECATED = function () {
        $tierra = distribucionService.getAll(1);
        $tierra.then(function (datos) {
            var data = datos.data;
            $scope.tierraStock = datos.data;
            $scope.tableTierraStock = new NgTableParams({
                page: 1,
                count: 12
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.tierraStock;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };
    $scope.listaTierra = function () {
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
    };

    $scope.listaBebelandia = function () {
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
    };

    $scope.listaLibertador = function () {
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
    };

    $scope.listaFacturaTierra = function () {
        var idFactura = $stateParams.idFactura;
        $facturaTierra = distribucionService.getStockTierra(idFactura);
        $facturaTierra.then(function (datos) {
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
    };

    $scope.listaFacturaBebelandia = function () {
        var idFactura = $stateParams.idFactura;
        $facturaBebelandia = distribucionService.getStockBebelandia(idFactura);
        $facturaBebelandia.then(function (datos) {
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
    };

    $scope.listaFacturaLibertador = function () {
        var idFactura = $stateParams.idFactura;
        $facturaLibertador = distribucionService.getStockLibertador(idFactura);
        $facturaLibertador.then(function (datos) {
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
    };

    $scope.distribuirModal = function (producto) {
        $rootScope.modalProducto = producto;
        ngDialog.open({
            template: 'views/distribucion/modal-distribuir-stock.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'DistribucionController',
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.confirmarDistribuir = function (modalDistribuir) {
        var control = 0;
        control = modalDistribuir.tierra + modalDistribuir.bebelandia + modalDistribuir.libertador;
        if (control === $rootScope.modalProducto.cantidadTotal) {
            if (modalDistribuir.tierra !== null) {
                $scope.wrapper.stockTierra.idProducto = $rootScope.modalProducto;
                $scope.wrapper.stockTierra.cantidad = modalDistribuir.tierra;
            }
            if (modalDistribuir.bebelandia !== null) {
                $scope.wrapper.stockBebelandia.idProducto = $rootScope.modalProducto;
                $scope.wrapper.stockBebelandia.cantidad = modalDistribuir.bebelandia;
            }
            if (modalDistribuir.libertador !== null) {
                $scope.wrapper.stockLibertador.idProducto = $rootScope.modalProducto;
                $scope.wrapper.stockLibertador.cantidad = modalDistribuir.libertador;
            }
            ngDialog.open({
                template: 'views/distribucion/modal-confirmacion-distribuir.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'DistribucionController',
                closeByDocument: false,
                closeByEscape: false,
                data: {
                    'wrapper': $scope.wrapper,
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
    };

    $scope.finalizarDistribucion = function () {
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
        $distribute = distribucionService.add($scope.sendWrapper);
        $distribute.then(function (datos) {
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
    };

    $scope.$on('updateTables', function (event, object) {
        var idFactura = parseInt($stateParams.idFactura);
        object.estadoDistribucion = true;
        $updateProducto = _productoService.update(object);
        $updateProducto.then(function (datos) {
            if (datos.status === 200) {
                $rootScope.$broadcast('updateTableProducto', {'idFactura': idFactura});
            }
        });
    });

    $scope.$on('updateStock', function (event, object) {
        var idFactura = parseInt($stateParams.idFactura);
        $facturaTierra = distribucionService.getStockTierra(idFactura);
        $facturaTierra.then(function (datos) {
            $scope.facturaTierra = datos.data;
            $scope.tableFacturaTierra.reload();
        });
        $facturaBebelandia = distribucionService.getStockBebelandia(idFactura);
        $facturaBebelandia.then(function (datos) {
            $scope.facturaBebelandia = datos.data;
            $scope.tableFacturaBebelandia.reload();
        });
        $facturaLibertador = distribucionService.getStockLibertador(idFactura);
        $facturaLibertador.then(function (datos) {
            $scope.facturaLibertador = datos.data;
            $scope.tableFacturaLibertador.reload();
        });
    });

    $scope.verificarDistribucion = function (facturaProducto) {
        if (facturaProducto.carga === true) {
            ngDialog.open({
                template: 'views/distribucion/modal-advertencia-distribuir.html',
                scope: $scope,
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'DistribucionController',
                closeByDocument: false,
                closeByEscape: false
            });
        } else {
            $state.go('distribuir_productos', {idFactura: facturaProducto.idFacturaProducto});
        }

    };

    $scope.confirmarFinalizarDistribucion = function (detalle) {
        ngDialog.open({
            template: 'views/distribucion/modal-confirmar-finalizar.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'DistribucionController',
            closeByDocument: false,
            closeByEscape: false,
            data: {'detalle': detalle}
        });
    };

    $scope.finalizarEstadoDistribucion = function () {
        $scope.ngDialogData.detalle.estadoLocal = "REPARTIDO";
        $estado = facturaProductoService.update($scope.ngDialogData.detalle);
        $estado.then(function (datos) {
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
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

});