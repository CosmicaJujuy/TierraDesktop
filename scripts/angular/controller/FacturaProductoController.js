/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('FacturaProductoController', function (
        $scope,
        BaseURL,
        $http,
        cookieService,
        ngDialog,
        NgTableParams,
        toaster,
        $timeout,
        facturaProductoService,
        $state,
        $stateParams) {

    $scope._facturaProducto = {
        "idFacturaProducto": null,
        "proveedor": null,
        "monto": null,
        "fechaFactura": "",
        "fechaCreacion": "",
        "fechaModificacion": null,
        "usuarioCreacion": null,
        "usuarioModificacion": null,
        "estado": true,
        "observaciones": null,
        "estadoLocal": null,
        "numeroFactura": "",
        "carga": null
    };


    /**
     * Funciones encargadas de manejar el datepicker en productos
     */
    $scope.dateOptions = {
        maxDate: new Date(2020, 5, 22),
        minDate: null,
        startingDay: 1
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };


    $scope.listaFacturaProducto = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableFacturaProductos = new NgTableParams({
                page: 1,
                count: 13
            }, {
                getData: function (params) {
                    return $http({
                        url: BaseURL + "facturaProducto/list/paged",
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

    $scope.detallesFacturaProducto = function () {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $detail = facturaProductoService.detail(idFacturaProducto);
        $detail.then(function (datos) {
            if (datos.status === 200) {
                if (datos.data.carga === false) {
                    $state.go('productos');
                } else {
                    $scope.detalle = datos.data;
                    var splited = datos.data.fechaFactura.split("-");
                    var date = new Date(splited[0], splited[1] - 1, splited[2]);
                    $scope.detalle.fechaFactura = date;
                }
            }
        });
    };

    $scope.confirmarFinalizarCargaFactura = function () {
        ngDialog.open({
            template: 'views/factura_producto/modal-confirmar-finalizar-carga-factura.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'FacturaProductoController',
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.finalizarCargaFactura = function () {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $finish = facturaProductoService.finish(idFacturaProducto);
        $finish.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Carga finalizada.',
                    showCloseButton: false
                });
                $timeout(function timer() {
                    $state.go('productos');
                }, 2000);
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

    $scope.agregarProductoFactura = function () {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $state.go('add_producto_factura', {"idFactura": idFacturaProducto});
    };

    $scope.agregarFacturaProducto = function (facturaProducto) {
        $add = facturaProductoService.add(facturaProducto);
        $add.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Factura de producto agregada con exito.',
                    showCloseButton: false
                });
                $timeout(function timer() {
                    $state.go('panel_factura_producto', {"idFactura": datos.data.msg});
                }, 2000);
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


    $scope.confirmarActualizarFacturaProducto = function (toUpdate) {
        ngDialog.open({
            template: 'views/factura_producto/modal-confirmar-actualizacion.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'FacturaProductoController',
            closeByDocument: false,
            closeByEscape: false,
            data: {
                'toUpdate': toUpdate
            }
        });
    };

    $scope.actualizarFacturaProducto = function () {
        $toUpdate = facturaProductoService.update($scope.ngDialogData.toUpdate);
        $toUpdate.then(function (datos) {
            ngDialog.closeAll();
            if (datos.status === 200) {
                $timeout(function timer() {
                    $state.go($state.current, {}, {reload: true});
                }, 2000);
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



});