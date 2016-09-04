(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('TransferenciaController', TransferenciaController);

    TransferenciaController.$inject = ['$scope', 'toaster', 'ngDialog', '$state', '$stateParams', 'detalleTransferenciaService', 'transferenciaService', 'NgTableParams'];

    function TransferenciaController($scope, toaster, ngDialog, $state, $stateParams, detalleTransferenciaService, transferenciaService, NgTableParams) {
        var vm = this;
        /*VARIABLES*/
        vm._transferencia = {
            estadoPedido: null,
            fechaCreacion: null,
            fechaModificacion: null,
            idTransferencia: null,
            sucursalPedido: null,
            sucursalRespuesta: null,
            usuarioCreacion: null,
            usuarioModificacion: null
        };
        vm.busq = {
            categoria: "",
            codigo: "",
            descripcion: "",
            marca: "",
            sucursal: "1",
            talla: ""
        };
        vm.oculto = false;
        vm.transferencia = null;
        /*METODOS*/
        vm.aceptarTransferencia = aceptarTransferencia;
        vm.agregarTransferencia = agregarTransferencia;
        vm.buscarStock = buscarStock;
        vm.cancelarTransferencia = cancelarTransferencia;
        vm.cleanBusqAvanzada = cleanBusqAvanzada;
        vm.datosTransferencia = datosTransferencia;
        vm.eliminarDetalleTransferencia = eliminarDetalleTransferencia;
        vm.listaHoyTransferencias = listaHoyTransferencias;
        vm.listaDetalleTransferencia = listaDetalleTransferencia;
        vm.listaMesTransferencias = listaMesTransferencias;
        vm.modificarDetalleTransferencia = modificarDetalleTransferencia;

        function aceptarTransferencia() {
            ngDialog.open({
                template: 'views/transferencia/modal-aceptar-transferencia.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true
            });
        }

        function agregarTransferencia() {
            transferenciaService
                    .add(vm._transferencia)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $state.go('transferencias_detalle', {idTransferencia: datos.data});
                        }
                    });
        }

        function buscarStock(busq) {
            detalleTransferenciaService
                    .findByParams(busq)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.stock = datos.data;
                            ngDialog.open({
                                template: 'views/transferencia/modal-busqueda-transferencia.html',
                                className: 'ngdialog-theme-lg ngdialog-theme-custom',
                                showClose: false,
                                controller: 'ModalController',
                                closeByDocument: false,
                                closeByEscape: true,
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
        }

        function cancelarTransferencia() {
            transferenciaService
                    .getById($stateParams.idTransferencia)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            ngDialog.open({
                                template: 'views/transferencia/modal-cancelar-transferencia.html',
                                className: 'ngdialog-theme-sm',
                                showClose: false,
                                controller: 'ModalController',
                                closeByDocument: false,
                                closeByEscape: true,
                                data: {transferencia: datos.data}
                            });
                        }
                    });
        }

        function cleanBusqAvanzada() {
            if (!vm.oculto) {
                vm.busq.categoria = "";
                vm.busq.codigo = "";
                vm.busq.marca = "";
                vm.busq.talla = "";
            }
        }

        function datosTransferencia() {
            transferenciaService
                    .getById($stateParams.idTransferencia)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            vm.transferencia = datos.data;
                        }
                    });
        }

        function eliminarDetalleTransferencia(detalle) {
            ngDialog.open({
                template: 'views/transferencia/modal-confirmar-eliminar-detalle.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalle: detalle}
            });
        }

        function listaHoyTransferencias() {
            transferenciaService
                    .getDaily()
                    .then(function (datos) {
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
        }

        function listaDetalleTransferencia() {
            detalleTransferenciaService
                    .getDetalleTransferencia($stateParams.idTransferencia)
                    .then(function (datos) {
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
        }

        function listaMesTransferencias() {
            transferenciaService
                    .getMonth()
                    .then(function (datos) {
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
        }

        function modificarDetalleTransferencia(detalle) {
            ngDialog.open({
                template: 'views/transferencia/modal-modificar-detalle.html',
                className: 'ngdialog-theme-sm ngdialog-theme-custom',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {detalle: detalle}
            });
        }

        $scope.$on('reloadTransferenciaDatos', function () {
            transferenciaService
                    .getById($stateParams.idTransferencia)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.transferencia = datos.data;
                        }
                    });
        });

        $scope.$on('reloadTransferencias', function () {
            detalleTransferenciaService
                    .getDetalleTransferencia($stateParams.idTransferencia)
                    .then(function (datos) {
                        $scope.detallesTrans = datos.data;
                        $scope.TableDetallesTrans.reload();
                    });
        });

    }

})();