(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('TarjetaController', TarjetaController);

    TarjetaController.$inject = ['$scope', 'ngDialog', '$state', 'NgTableParams', 'tarjetaService', '$timeout', 'toaster'];

    function TarjetaController($scope, ngDialog, $state, NgTableParams, tarjetaService, $timeout, toaster) {
        var vm = this;
        /*VARIABLES*/
        vm._tarjeta = {
            "idTarjeta": null,
            "entidadBancaria": null,
            "medioPago": null,
            "nombreTarjeta": "",
            "estadoTarjeta": true,
            "fechaCreacion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        };
        vm.editTarjeta = null;
        vm.panelTarjetaEdit = true;
        /*METODOS*/
        vm.agregarTarjeta = agregarTarjeta;
        vm.eliminarTarjeta = eliminarTarjeta;
        vm.hidePanel = hidePanel;
        vm.listaTarjetas = listaTarjetas;
        vm.modificarTarjeta = modificarTarjeta;

        function agregarTarjeta(tarjeta) {
            tarjetaService
                    .add(tarjeta)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Tarjeta agregada existosamente.',
                                showCloseButton: false
                            });
                            $timeout(function timer() {
                                $state.go($state.current, {}, {reload: true});
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
        }

        function eliminarTarjeta(tarjeta) {
            ngDialog.open({
                template: 'views/tarjeta/modal-confirmar-eliminar-tarjeta.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {tarjeta: tarjeta}
            });
        }

        function hidePanel(tarjeta) {
            vm.editTarjeta = tarjeta;
            vm.panelTarjetaEdit = false;
        }

        function listaTarjetas() {
            $scope.tarjetas = "";
            tarjetaService
                    .getAll()
                    .then(function (datos) {
                        $scope.tarjetas = datos.data;
                        var data = datos.data;
                        $scope.tableTarjetas = new NgTableParams({
                            page: 1,
                            count: 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.tarjetas;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }});
                    });
        }

        function modificarTarjeta(tarjeta) {
            ngDialog.open({
                template: 'views/tarjeta/modal-confirmar-modificar-tarjeta.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {tarjeta: tarjeta}
            });
        }

        $scope.$on('reloadTarjetas', function () {
            vm.panelTarjetaEdit = true;
            tarjetaService
                    .getAll()
                    .then(function (datos) {
                        $scope.tarjetas = datos.data;
                        $scope.tableTarjetas.reload();
                    });
        });

    }

})();