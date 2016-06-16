/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('ModalController', function ($scope, ngDialog, $stateParams, _productoService, toaster, facturaService, $routeParams, $timeout, $rootScope, facturaService) {

    $scope._detalleFactura = {
        "idDetalleFactura": null,
        "factura": null,
        "producto": null,
        "cantidadDetalle": null,
        "totalDetalle": null,
        "descuentoDetalle": null,
        "estadoDetalle": true,
        "usuarioCreacion": null,
        "usuarioModificacion": null,
        "fechaCreacion": null,
        "fechaModificacion": null,
        "idStock": null
    };
    $scope.toUpdateFactura = "";
    $scope.modalBarcode = "";
    $scope.percent = null;
    $scope.mount = null;

    $scope.buscarModal = function (barcode) {
        $promesa = _productoService.searchByBarcode(barcode);
        $promesa.then(function (datos) {
            toaster.pop({
                type: 'success',
                title: 'Encontrado/s',
                body: 'Se encontraron productos',
                showCloseButton: false
            });
            $rootScope.productosBarcode = datos.data;
        }).catch(function (fallback) {
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: 'No se han encontrado productos',
                showCloseButton: false
            });
        });
    };

    $scope.addDetalleFacturaModal = function () {
        var idFactura = $stateParams.idFactura;
        if ($scope._detalleFactura.cantidadDetalle !== null) {
            var descuento = 0;
            if ($scope.percent !== "") {
                descuento = ($rootScope.productoSelected.precioVenta * $scope.percent) / 100;
            }
            if ($scope.mount !== "") {
                descuento = $scope.mount;
            }
            if ($rootScope.productoSelected.cantidadTotal >= $scope._detalleFactura.cantidadDetalle) {
                $promesa = facturaService.searchById(idFactura);
                $promesa.then(function (datos) {
                    $scope._detalleFactura.factura = datos.data;
                    $scope._detalleFactura.producto = $rootScope.productoSelected;
                    $scope._detalleFactura.descuentoDetalle = descuento;
                    $addDetalle = facturaService.addDetalleFactura($scope._detalleFactura);
                    $addDetalle.then(function (datos) {
                        toaster.pop({
                            type: 'success',
                            title: 'Encontrado/s',
                            body: 'Se ha agregado detalle nuevo.',
                            showCloseButton: false
                        });
                    });
                    $timeout(function timer() {
                        $scope.toUpdateFactura = datos.data;
                        $listDetalles = facturaService.getDetalleFacturaList(idFactura);
                        $listDetalles.then(function (datos) {
                            console.log(datos);
                            var totalUpdate = 0;
                            angular.forEach(datos.data, function (value, key) {
                                totalUpdate = parseFloat(totalUpdate) + parseFloat(value.totalDetalle);
                            });
                            $scope.toUpdateFactura.total = totalUpdate;
                            $updateTotal = facturaService.update($scope.toUpdateFactura);
                            $updateTotal.then(function (datos) {
                                $updated = facturaService.searchById(idFactura);
                                $updated.then(function (datos) {
                                    $rootScope.factura = datos.data;
                                });
                            });
                            //                                        $uibModalInstance.close();
                            $rootScope.$emit('ReloadTable', {});
                        });
                    }, 2000);
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'El stock actual es insuficiente a la cantidad ingresada.',
                    showCloseButton: false
                });
            }
        } else {
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: 'La cantidad no puede estar vacia.',
                showCloseButton: false
            });
        }
    };


    $rootScope.$on('ReloadTable', function () {
        $timeout(function timer() {
            //                        $uibModalInstance.close();
        }, 1000);
    });


    $scope.agregarItem = function (item) {
        ngDialog.open({
            template: 'views/factura/modal-agregar-item.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {
                item: item
            }
        });
    };

    $scope.confirmarAgregarItem = function (item, cantidad) {
        var idFactura = $stateParams.idFactura;
        if (item.cantidad < cantidad) {
            toaster.pop({
                type: 'warning',
                title: 'Error',
                body: 'El stock actual es insuficiente a la cantidad ingresada.',
                showCloseButton: false
            });
        } else {
            $addDetalle = facturaService.addDetalleFactura(idFactura, item.idProducto.idProducto, item.idStock, cantidad);
            $addDetalle.then(function (datos) {
                if (datos.status === 200) {
                    $updated = facturaService.searchById(idFactura);
                    $updated.then(function (datos) {
                        $rootScope.factura = datos.data;
                        $rootScope.$broadcast('reloadDetalles');
                    });
                    toaster.pop({
                        type: 'success',
                        title: 'Exito',
                        body: 'Se ha agregado un detalle nuevo.',
                        showCloseButton: false
                    });
                    ngDialog.closeAll();
                }
            });
        }
    };

    $scope.confirmarCargarDescuento = function (item) {
        if ($scope.mount === null && $scope.percent === null) {
            toaster.pop({
                type: 'error',
                title: 'Error.',
                body: 'Debes ingresar un valor.',
                showCloseButton: false
            });
        } else {
            ngDialog.open({
                template: 'views/factura/modal-confirmar-cargar-descuento.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: false,
                data: {
                    item: item,
                    mount: $scope.mount,
                    percent: $scope.percent
                }
            });
        }
    };

    $scope.finalizarCargarDescuento = function (obj) {
        var idFactura = $stateParams.idFactura;
        var descuento = 0;
        if (obj.percent !== null) {
            descuento = (obj.item.totalDetalle * obj.percent) / 100;
        } else {
            descuento = obj.mount;
        }
        obj.item.descuentoDetalle = descuento;
        obj.item.totalDetalle = obj.item.totalDetalle - descuento;
        $descuento = facturaService.updateDetalleFactura(obj.item);
        $descuento.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                $updated = facturaService.searchById(idFactura);
                $updated.then(function (datos) {
                    $rootScope.factura = datos.data;
                    $rootScope.$broadcast('reloadDetalles');
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito.',
                    body: 'Descuento aplicado con exito.',
                    showCloseButton: false
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error.',
                    body: 'Ops algo ha pasado, comunicate con el administrador.',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.finalizarEliminarDescuento = function (detalle, dni, pw) {
        var idFactura = $stateParams.idFactura;
        $discount = facturaService.deleteDiscount(detalle, dni, pw);
        $discount.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                $updated = facturaService.searchById(idFactura);
                $updated.then(function (datos) {
                    $rootScope.factura = datos.data;
                    $rootScope.$broadcast('reloadDetalles');
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito.',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error.',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            }
        });
    };

    $scope.finalizarEliminarDetalleFactura = function (obj, dni, pw) {
        var idFactura = $stateParams.idFactura;
        $delete = facturaService.deleteDetalleFactura(obj, dni, pw);
        $delete.then(function (datos) {
            console.log(datos);
            if (datos.status === 200) {
                ngDialog.closeAll();
                $updated = facturaService.searchById(idFactura);
                $updated.then(function (datos) {
                    $rootScope.factura = datos.data;
                    $rootScope.$broadcast('reloadDetalles');
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito.',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error.',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            }
        });
    };

});

