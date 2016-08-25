/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('TarjetaController',
        function ($scope, ngDialog, $state, NgTableParams, tarjetaService, $timeout, toaster) {

            $scope._tarjeta = {
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

            $scope.listaTarjetas = function () {
                $scope.tarjetas = "";
                $promesa = tarjetaService.getAll();
                $promesa.then(function (datos) {
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
            };

            $scope.seleccionarTarjeta = function (tarjeta) {
                $scope.tarjetaSeleccionada = tarjeta;
            };

            $scope.panelTarjetaEdit = true;
            $scope.hidePanel = function (tarjeta) {
                $scope.editTarjeta = tarjeta;
                $scope.panelTarjetaEdit = false;
            };

            $scope.agregarTarjeta = function (tarjeta) {
                $promesa = tarjetaService.add(tarjeta);
                $promesa.then(function (datos) {
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
            };


            $scope.modificarTarjeta = function (tarjeta) {
                ngDialog.open({
                    template: 'views/tarjeta/modal-confirmar-modificar-tarjeta.html',
                    className: 'ngdialog-theme-sm',
                    showClose: false,
                    controller: 'ModalController',
                    closeByDocument: false,
                    closeByEscape: true,
                    data: {tarjeta: tarjeta}
                });
            };

            $scope.eliminarTarjeta = function (tarjeta) {
                ngDialog.open({
                    template: 'views/tarjeta/modal-confirmar-eliminar-tarjeta.html',
                    className: 'ngdialog-theme-sm',
                    showClose: false,
                    controller: 'ModalController',
                    closeByDocument: false,
                    closeByEscape: true,
                    data: {tarjeta: tarjeta}
                });
            };

            $scope.$on('reloadTarjetas', function () {
                $scope.panelTarjetaEdit = true;
                $reload = tarjetaService.getAll();
                $reload.then(function (datos) {
                    $scope.tarjetas = datos.data;
                    $scope.tableTarjetas.reload();
                });
            });


        });

