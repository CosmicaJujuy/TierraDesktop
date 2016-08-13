miAppHome.controller('TransferenciaController', function ($scope, toaster, ngDialog, $state, $stateParams, detalleTransferenciaService, transferenciaService, NgTableParams) {

    $scope._transferencia = {
        estadoPedido: null,
        fechaCreacion: null,
        fechaModificacion: null,
        idTransferencia: null,
        sucursalPedido: null,
        sucursalRespuesta: null,
        usuarioCreacion: null,
        usuarioModificacion: null
    };

    $scope.busq = {
        categoria: "",
        codigo: "",
        descripcion: "",
        marca: "",
        sucursal: "1",
        talla: ""
    };

    $scope.oculto = false;

    $scope.listaHoyTransferencias = function () {
        $transferencias = transferenciaService.getDaily();
        $transferencias.then(function (datos) {
            var data = datos.data;
            $scope.resueltasHoy = 0;
            $scope.TotalHoy = 0;
            angular.forEach(datos.data, function (value, key) {
                $scope.TotalHoy = $scope.TotalHoy + 1;
                if (value.estadoPedido === true) {
                    $scope.resueltasHoy = $scope.resueltasHoy + 1;
                }
            });
            $scope.transferenciasHoy = datos.data;
            $scope.tableHoyTransferencias = new NgTableParams({
                page: 1,
                count: 12
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.transferenciasHoy;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.listaMesTransferencias = function () {
        $transferencias = transferenciaService.getMonth();
        $transferencias.then(function (datos) {
            var data = datos.data;
            $scope.resueltasMes = 0;
            $scope.TotalMes = 0;
            angular.forEach(datos.data, function (value, key) {
                $scope.TotalMes = $scope.TotalMes + 1;
                if (value.estadoPedido === true) {
                    $scope.resueltasMes = $scope.resueltasMes + 1;
                }
            });
            $scope.transferenciasMoth = datos.data;
            $scope.tableMesTransferencias = new NgTableParams({
                page: 1,
                count: 12
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.transferenciasMoth;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.cleanBusqAvanzada = function () {
        if (!$scope.oculto) {
            $scope.busq.categoria = "";
            $scope.busq.codigo = "";
            $scope.busq.marca = "";
            $scope.busq.talla = "";
        }
    };

    $scope.agregarTransferencia = function () {
        $add = transferenciaService.add($scope._transferencia);
        $add.then(function (datos) {
            if (datos.status === 200) {
                $state.go('transferencias_detalle', {idTransferencia: datos.data});
            }
        });
    };

    $scope.datosTransferencia = function () {
        $trans = transferenciaService.getById($stateParams.idTransferencia);
        $trans.then(function (datos) {
            if (datos.status === 200) {
                $scope.transferencia = datos.data;
            }
        });
    };

    $scope.$on('reloadTransferenciaDatos', function () {
        console.log("entro");
        $trans = transferenciaService.getById($stateParams.idTransferencia);
        $trans.then(function (datos) {
            if (datos.status === 200) {
                $scope.transferencia = datos.data;
            }
        });
    });

    $scope.listaDetalleTransferencia = function () {
        $det = detalleTransferenciaService.getDetalleTransferencia($stateParams.idTransferencia);
        $det.then(function (datos) {
            var data = datos.data;
            $scope.detallesTrans = datos.data;
            $scope.TableDetallesTrans = new NgTableParams({
                page: 1,
                count: 5
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.detallesTrans;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.buscarStock = function (busq) {
        $busq = detalleTransferenciaService.findByParams(busq);
        $busq.then(function (datos) {
            if (datos.status === 200) {
                $scope.stock = datos.data;
                ngDialog.open({
                    template: 'views/transferencia/modal-busqueda-transferencia.html',
                    className: 'ngdialog-theme-lg ngdialog-theme-custom',
                    showClose: false,
                    controller: 'ModalController',
                    closeByDocument: false,
                    closeByEscape: false,
                    data: {stock: $scope.stock, sucursal: busq.sucursal}
                });
            } else {
                if (datos.status === 400) {
                    toaster.pop({
                        type: 'warning',
                        title: '¡Atention!',
                        body: 'No puedes solicitar tu propio stock.',
                        showCloseButton: false
                    });
                }
            }
        });
    };

    $scope.$on('reloadTransferencias', function () {
        $det = detalleTransferenciaService.getDetalleTransferencia($stateParams.idTransferencia);
        $det.then(function (datos) {
            $scope.detallesTrans = datos.data;
            $scope.TableDetallesTrans.reload();
        });
    });

    $scope.eliminarDetalleTransferencia = function (detalle) {
        ngDialog.open({
            template: 'views/transferencia/modal-confirmar-eliminar-detalle.html',
            className: 'ngdialog-theme-sm ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {detalle: detalle}
        });
    };

    $scope.modificarDetalleTransferencia = function (detalle) {
        ngDialog.open({
            template: 'views/transferencia/modal-modificar-detalle.html',
            className: 'ngdialog-theme-sm ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {detalle: detalle}
        });
    };

    $scope.aceptarTransferencia = function () {
        ngDialog.open({
            template: 'views/transferencia/modal-aceptar-transferencia.html',
            className: 'ngdialog-theme-sm ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false
        });
    };

    $scope.cancelarTransferencia = function () {
        $trans = transferenciaService.getById($stateParams.idTransferencia);
        $trans.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.open({
                    template: 'views/transferencia/modal-cancelar-transferencia.html',
                    className: 'ngdialog-theme-sm',
                    showClose: false,
                    controller: 'ModalController',
                    closeByDocument: false,
                    closeByEscape: false,
                    data: {transferencia: datos.data}
                });
            }
        });
    };
});

