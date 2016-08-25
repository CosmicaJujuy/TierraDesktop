miAppHome.controller('NotaCreditoController', function (toaster, $mdDialog, ngDialog, $rootScope, detalleNotaCreditoService, $scope, $state, $stateParams, notaCreditoService, NgTableParams) {

    $scope._notaCredito = {
        estadoUso: null,
        fechaCreacion: null,
        fechaModificacion: null,
        idCliente: null,
        idNotaCredito: null,
        montoTotal: 0,
        numero: null,
        usuarioCreacion: null,
        usuarioModificacion: null
    };

    $scope.listaHoyNotaCredito = function () {
        $scope.totalNota = 0;
        $scope.countNotas = 0;
        $notas = notaCreditoService.getDaily();
        $notas.then(function (datos) {
            if (datos.status === 200) {
                $scope.notasCredito = datos.data;
                var data = datos.data;
                angular.forEach(data, function (value, key) {
                    if (value.estadoUso !== 'CARGANDO') {
                        $scope.countNotas = $scope.countNotas + 1;
                        $scope.totalNota = parseFloat($scope.totalNota) + parseFloat(value.montoTotal);
                    }
                });
                $scope.tableNotaCredito = new NgTableParams({
                    page: 1,
                    count: 12
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.notasCredito;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.listaMesNotaCredito = function () {
        $scope.totalNotaMonth = 0;
        $scope.countNotasMonth = 0;
        $notas = notaCreditoService.getMonth();
        $notas.then(function (datos) {
            if (datos.status === 200) {
                $scope.notasCreditoMes = datos.data;
                var data = datos.data;
                angular.forEach(data, function (value, key) {
                    if (value.estadoUso !== 'CARGANDO') {
                        $scope.countNotasMonth = $scope.countNotasMonth + 1;
                        $scope.totalNotaMonth = parseFloat($scope.totalNotaMonth) + parseFloat(value.montoTotal);
                    }
                });
                $scope.tableNotaCreditoMes = new NgTableParams({
                    page: 1,
                    count: 12
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.notasCreditoMes;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.detalleNotaCredito = function () {
        var idNota = $stateParams.idNota;
        $detalle = notaCreditoService.getById(idNota);
        $detalle.then(function (datos) {
            if (datos.status === 200) {
                $rootScope.notaCreditoDetalle = datos.data;
            }
        });
    };

    $scope.agregarNotaCredito = function (nota) {
        var codigo = Math.floor((Math.random() * 99999) + 10000);
        nota.numero = codigo.toString();
        $add = notaCreditoService.add(nota);
        $add.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Nota de credito agregada con exito.',
                    showCloseButton: false
                });
                $state.transitionTo('detalle_nota_credito', {idNota: datos.data.msg});
            }
        });
    };


    $scope.$on('updateMontoNota', function () {
        var idNota = $stateParams.idNota;
        $list = detalleNotaCreditoService.getNotaCreditoDetail(idNota);
        $list.then(function (datos) {
            if (datos.status === 200) {
                var monto = 0;
                angular.forEach(datos.data, function (value, key) {
                    monto = parseFloat(monto) + parseFloat(value.monto);
                });
                $scope.detalleNotaCredito();
                $rootScope.notaCreditoDetalle.montoTotal = monto;
                $update = notaCreditoService.update($rootScope.notaCreditoDetalle);
                $update.then(function (datos) {
                    if (datos.status === 200) {
                        var idNota = $stateParams.idNota;
                        $detalle = notaCreditoService.getById(idNota);
                        $detalle.then(function (datos) {
                            if (datos.status === 200) {
                                $rootScope.notaCreditoDetalle = datos.data;
                            }
                        });
                    }
                });
            } else {
                var montoError = 0;
                $rootScope.notaCreditoDetalle.montoTotal = montoError;
                $update = notaCreditoService.update($rootScope.notaCreditoDetalle);
                $update.then(function (datos) {
                    if (datos.status === 200) {
                        var idNota = $stateParams.idNota;
                        $detalle = notaCreditoService.getById(idNota);
                        $detalle.then(function (datos) {
                            if (datos.status === 200) {
                                $rootScope.notaCreditoDetalle = datos.data;
                            }
                        });
                    }
                });
            }
        });
    });

    $scope.finalizarNotaCredito = function (cli) {
        ngDialog.open({
            template: 'views/nota_credito/modal-confirmar-cerrar-nota.html',
            className: 'ngdialog-theme-advertencia ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {cliente: cli}
        });
    };

    $scope.cancelarNotaCredito = function () {
        var nota = $stateParams.idNota;
        ngDialog.open({
            template: 'views/nota_credito/modal-cancelar-nota.html',
            className: 'ngdialog-theme-advertencia ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {nota: nota}
        });
    };

});