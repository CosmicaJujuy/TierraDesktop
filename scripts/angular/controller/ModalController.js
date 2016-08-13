/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('ModalController', function (
        $scope,
        metodoPagoFacturaService,
        _proveedorService,
        _tipoService,
        _marcaService,
        categoriaService,
        planPagoService,
        tarjetaService,
        entidadBancariaService,
        detalleTransferenciaService,
        transferenciaService,
        notaCreditoService,
        detalleNotaCreditoService,
        $state,
        ngDialog,
        $stateParams,
        _productoService,
        toaster,
        facturaService,
        $timeout,
        $rootScope,
        facturaService) {

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

    $scope._detalleNotaCredito = {
        cantidad: null,
        detalleFactura: null,
        fechaCreacion: null,
        fechaModificacion: null,
        idDetalleNotaCredito: null,
        monto: null,
        notaCredito: null,
        usuarioCreacion: null,
        usuarioModificacion: null
    };

    $scope.detalleTransferencia = {
        idTransferencia: null,
        producto: null,
        idStock: null,
        idSucursal: null,
        cantidad: null
    };

    $scope._planPago = {
        "idPlanesPago": null,
        "tarjeta": null,
        "nombrePlanesPago": "",
        "cuotasPlanesPago": null,
        "fechaInicioPlanes": "",
        "fechaFinalizacionPlanes": null,
        "porcentajeInterez": null,
        "fechaCierre": "",
        "estadoPlanes": true,
        "fechaCreacion": "",
        "fechaModificacion": "",
        "usuarioCreacion": null,
        "usuarioMoficacion": null
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

    $scope.agregarItem = function (item) {
        ngDialog.open({
            template: 'views/factura/modal-agregar-item.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {item: item}
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

    $scope.confirarPanelDevolverItem = function (cantidad, detalle) {
        var idNota = $stateParams.idNota;
        if (cantidad > detalle.cantidadDetalle) {
            toaster.pop({
                type: 'error',
                title: '¡Error!',
                body: 'La cantidad supera al detalle.',
                showCloseButton: false
            });
        } else {
            $nota = notaCreditoService.getById(idNota);
            $nota.then(function (datos) {
                if (datos.status === 200) {
                    $scope._detalleNotaCredito.notaCredito = datos.data;
                    $scope._detalleNotaCredito.cantidad = cantidad;
                    $scope._detalleNotaCredito.detalleFactura = detalle;
                    var desc = detalle.descuentoDetalle / detalle.cantidadDetalle;
                    var monto = (detalle.producto.precioVenta * cantidad) - (desc * cantidad);
                    $scope._detalleNotaCredito.monto = monto;
                    $add = detalleNotaCreditoService.add($scope._detalleNotaCredito);
                    $add.then(function (datos) {
                        if (datos.status === 200) {
                            ngDialog.closeAll();
                            toaster.pop({
                                type: 'success',
                                title: '¡Exito!',
                                body: 'Detalle agregado con exito.',
                                showCloseButton: false
                            });
                            $rootScope.$broadcast('updateMontoNota', {});
                            $rootScope.$broadcast('updateDetalleNotaCredito', {});
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: '¡Error!',
                                body: 'Este detalle ya ha sido registrado previamente.',
                                showCloseButton: false
                            });
                        }
                    });
                }
            });
        }
    };

    $scope.confirmarEliminarDetalleNota = function (detalle) {
        $delete = detalleNotaCreditoService.delete(detalle);
        $delete.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: 'Detalle eliminado con exito.',
                    showCloseButton: false
                });
                $rootScope.$broadcast('updateDetalleNotaCredito2', {});
                $rootScope.$broadcast('updateMontoNota', {});
            }
        });
    };

    $scope.confirmarModificarDetalleNota = function (detalle) {
        if (detalle.cantidad > detalle.detalleFactura.cantidadDetalle) {
            toaster.pop({
                type: 'error',
                title: '¡Error!',
                body: 'La cantidad supera al detalle.',
                showCloseButton: false
            });
        } else {
            var desc = detalle.detalleFactura.descuentoDetalle / detalle.detalleFactura.cantidadDetalle;
            var monto = (detalle.detalleFactura.producto.precioVenta * detalle.cantidad) - (desc * detalle.cantidad);
            detalle.monto = monto;
            ngDialog.open({
                template: 'views/nota_credito/modal-confirmar-modificar-detalle-nota.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: false,
                data: {detalle: detalle}
            });
        }
    };

    $scope.finalizarModificarDetalleNota = function (detalle) {
        $update = detalleNotaCreditoService.update(detalle);
        $update.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: 'Detalle modificado con exito.',
                    showCloseButton: false
                });
                $rootScope.$broadcast('updateDetalleNotaCredito2', {});
                $rootScope.$broadcast('updateMontoNota', {});
            }
        });
    };

    $scope.confirmarFinalizarNotaCredito = function (cli) {
        var idNota = $stateParams.idNota;
        $nota = notaCreditoService.getById(idNota);
        $nota.then(function (datos) {
            if (datos.status === 200) {
                if (typeof cli.idCliente !== 'undefined') {
                    datos.data.idCliente = cli.idCliente;
                }
                datos.data.estadoUso = "SIN USO";
                $update = notaCreditoService.update(datos.data);
                $update.then(function (datos) {
                    if (datos.status === 200) {
                        toaster.pop({
                            type: 'success',
                            title: '¡Exito!',
                            body: 'Detalle agregado con exito.',
                            showCloseButton: false
                        });
                        ngDialog.closeAll();
                        $timeout(function timer() {
                            $state.go('nota_credito');
                        }, 2000);
                    }
                });
            }
        });
    };

    $scope.confirmarCancelarNotaCredito = function (nota) {
        $delete = notaCreditoService.delete(nota);
        $delete.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: datos.data.msg,
                    showCloseButton: false
                });
                $timeout(function timer() {
                    $state.go('nota_credito');
                }, 2000);
            } else {
                toaster.pop({
                    type: 'error',
                    title: '¡Exito!',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            }
        });
    };

    $scope.transferirItem = function (item) {
        ngDialog.open({
            template: 'views/transferencia/modal-transferir-item.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {item: item}
        });
    };

    $scope.confirmarTransferirItem = function (item, cantidad) {
        if (cantidad <= item.cantidad) {
            ngDialog.open({
                template: 'views/transferencia/modal-confirmar-transferir-item.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: false,
                data: {item: item, cantidad: cantidad}
            });
        } else {
            toaster.pop({
                type: 'warning',
                title: '¡Advertencia!',
                body: 'La cantidad no puede superar al stock actual.',
                showCloseButton: false
            });
        }
    };

    $scope.finalizarTransferirItem = function (item, cantidad) {
        $transf = transferenciaService.getById($stateParams.idTransferencia);
        $transf.then(function (datos) {
            if (datos.status === 200) {
                $scope.detalleTransferencia.idTransferencia = datos.data;
                $scope.detalleTransferencia.producto = item.idProducto;
                $scope.detalleTransferencia.idStock = item.idStock;
                $scope.detalleTransferencia.idSucursal = item.idSucursal;
                $scope.detalleTransferencia.cantidad = cantidad;
                $add = detalleTransferenciaService.add($scope.detalleTransferencia);
                $add.then(function (datos) {
                    if (datos.status === 200) {
                        ngDialog.closeAll();
                        $rootScope.$broadcast('reloadTransferencias', {});
                        toaster.pop({
                            type: 'success',
                            title: '¡Exito!',
                            body: 'Detalle agregado con exito.',
                            showCloseButton: false
                        });
                    } else {
                        if (datos.status === 500) {
                            toaster.pop({
                                type: 'warning',
                                title: '¡Advertencia!',
                                body: 'Posiblemente el item ya existe.',
                                showCloseButton: false
                            });
                        }
                    }
                });
            }
        });
    };

    $scope.confirmarEliminarDetalleTransferencia = function (detalle) {
        $delete = detalleTransferenciaService.delete(detalle);
        $delete.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                $rootScope.$broadcast('reloadTransferencias', {});
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: 'Detalle eliminado con exito.',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.confirmarModificarDetalleTransferencia = function (detalle) {
        $update = detalleTransferenciaService.update(detalle);
        $update.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                $rootScope.$broadcast('reloadTransferencias', {});
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: 'Detalle modificado con exito.',
                    showCloseButton: false
                });
            } else {
                ngDialog.closeAll();
                toaster.pop({
                    type: 'warning',
                    title: '¡Advertencia!',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            }
        });
    };

    $scope.confirmarAceptarTransferencia = function () {
        $approve = transferenciaService.approve($stateParams.idTransferencia);
        $approve.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadTransferenciaDatos', {});
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            } else {
                toaster.pop({
                    type: 'warning',
                    title: '¡Advertencia!',
                    body: datos.data.msg,
                    showCloseButton: false
                });
            }
        });
    };

    $scope.confirmarCancelarTransferencia = function (transferencia) {
        transferencia.sucursalRespuesta = 5;
        $trans = transferenciaService.cancel(transferencia);
        $trans.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: '¡Exito!',
                    body: 'La transferencia ha sido cancelada.',
                    showCloseButton: false
                });
                $timeout(function timer() {
                    $state.go('transferencias');
                }, 2000);
            } else {
                toaster.pop({
                    type: 'error',
                    title: '¡Error!',
                    body: 'La transferencia no ha podido ser cancelada.',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.confirmarModificarEntidad = function (entidad) {
        ngDialog.open({
            template: 'views/banco/modal-confirmar-modificar-entidad.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {entidad: entidad}
        });
    };

    $scope.finalizarModificarEntidad = function (entidad) {
        $promesa = entidadBancariaService.update(entidad);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadEntidades', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Entidad modificada con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarEliminarEntidad = function (entidad) {
        $promesa = entidadBancariaService.delete(entidad);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadEntidades', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Entidad eliminada con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarModificarTarjeta = function (tarjeta) {
        $promesa = tarjetaService.update(tarjeta);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $timeout(function timer() {
                    $rootScope.$broadcast('reloadTarjetas', {});
                    toaster.pop({
                        type: 'success',
                        title: 'Exito',
                        body: 'Tarjeta modificada existosamente.',
                        showCloseButton: false
                    });
                }, 1000);
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

    $scope.confirmarEliminarTarjeta = function (tarjeta) {
        $promesa = tarjetaService.delete(tarjeta);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $timeout(function timer() {
                    $rootScope.$broadcast('reloadTarjetas', {});
                    toaster.pop({
                        type: 'success',
                        title: 'Exito',
                        body: 'Tarjeta eliminada existosamente.',
                        showCloseButton: false
                    });
                }, 1000);
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

    $scope.confirmarModificarPlan = function (planPago) {
        $promesa = planPagoService.update(planPago);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadPlanes', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Plan de pago modificado exitosamente',
                    showCloseButton: false
                });
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

    $scope.confirmarEliminarPlan = function (planPago) {
        $promesa = planPagoService.delete(planPago);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadPlanes', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Plan de pago eliminado exitosamente',
                    showCloseButton: false
                });
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

    $scope.confirmarModificarCategoria = function (categoria) {
        $promesa = categoriaService.updateCategoria(categoria);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadCategorias', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Categoria modificada con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarEliminarCategoria = function (categoria) {
        $promesa = categoriaService.deleteCategoria(categoria);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadCategorias', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Categoria eliminada con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarModificarMarca = function (marca) {
        $promesa = _marcaService.updateMarca(marca);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadMarcas', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Marca modificada con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarEliminarMarca = function (marca) {
        $promesa = _marcaService.deleteMarca(marca);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadMarcas', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Marca eliminada con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarModificarTipo = function (tipo) {
        $promesa = _tipoService.updateTipo(tipo);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadTipos', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Tipo modificado con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarEliminarTipo = function (tipo) {
        $promesa = _tipoService.deleteTipo(tipo);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadTipos', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Tipo eliminado con exito.',
                    showCloseButton: false
                });
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

    $scope.confirmarModificarProveedor = function (proveedor) {
        ngDialog.open({
            template: 'views/proveedor/modal-confirmar-modificar-proveedor.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {proveedor: proveedor}
        });
    };

    $scope.finalizarModificarProveedor = function (proveedor) {
        $promesa = _proveedorService.update(proveedor);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadProveedores', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Proveedor modificado exitosamente',
                    showCloseButton: false
                });
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

    $scope.confirmarEliminarProveedor = function (proveedor) {
        $promesa = _proveedorService.delete(proveedor);
        $promesa.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $rootScope.$broadcast('reloadProveedores', {});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Proveedor eliminado exitosamente',
                    showCloseButton: false
                });
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

    $scope.confirmarAgregarMetodoPago = function (metodo, factura) {
        switch (metodo.mediosPago.idMedioPago) {
            case 1:
                $scope._planPago.idPlanesPago = 1;
                $scope._metodoPago.planPago = $scope._planPago;
                break;
            case 2:
                $scope._metodoPago.planPago = metodo.planPago;
                break;
            case 3:
                $scope._metodoPago.planPago = metodo.planPago;
                break;
            case 4:
                $scope._planPago.idPlanesPago = 4;
                $scope._metodoPago.planPago = $scope._planPago;
                break;
        }
        $scope._metodoPago.montoPago = metodo.montoPago;
        $scope._metodoPago.comprobante = metodo.comprobantePago;
        $scope._metodoPago.factura = factura;
        $metodo = metodoPagoFacturaService.addMetodoPago($scope._metodoPago);
        $metodo.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $timeout(function timer() {
                    toaster.pop({
                        type: 'success',
                        title: 'Exito',
                        body: 'Metodo de pago agregado.',
                        showCloseButton: false
                    });
                }, 1000);
                $rootScope.$broadcast('reloadMetodo', {});
            } else {
                if (datos.status === 400) {
                    $timeout(function timer() {
                        toaster.pop({
                            type: 'warning',
                            title: 'Advertencia',
                            body: datos.data.msg,
                            showCloseButton: false
                        });
                    }, 1000);
                }
            }
        });
    };

    $scope.confirmarCancelarFactura = function () {
        $cancelar = facturaService.delete($stateParams.idFactura);
        $cancelar.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito.',
                    body: datos.data.msg,
                    showCloseButton: false
                });
                $timeout(function timer() {
                    $state.go('facturas');
                }, 3000);
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Advertencia',
                    body: datos.data.msg,
                    showCloseButton: false
                });

            }
        });
    };

});
