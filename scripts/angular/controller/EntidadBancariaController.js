(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('EntidadBancariaController', EntidadBancariaController);

    EntidadBancariaController.$inject = ['$scope', '$state', 'ngDialog', '$timeout', 'NgTableParams', 'toaster', 'entidadBancariaService', '$window'];

    function EntidadBancariaController($scope, $state, ngDialog, $timeout, NgTableParams, toaster, entidadBancariaService, $window) {
        var vm = this;
        /*VARIABLES*/
        vm._entidadBancaria = {
            "idEntidadMonetaria": null,
            "nombreEntidad": "",
            "direccionEntidad": "",
            "telefonoEntidad": "",
            "estadoEntidad": true,
            "fechaCreaciion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        };
        /*METODOS*/
        vm.agregarEntidad = agregarEntidad;
        vm.eliminarEntidad = eliminarEntidad;
        vm.listaEntidadBancaria = listaEntidadBancaria;
        vm.modificarEntidad = modificarEntidad;

        function agregarEntidad(entidad) {
            entidadBancariaService
                    .add(entidad)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Entidad agregada con exito.',
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

        function eliminarEntidad(entidad) {
            ngDialog.open({
                template: 'views/banco/modal-eliminar-entidad.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {entidad: entidad}
            });
        }

        function listaEntidadBancaria() {
            $scope.entidadBancarias = "";
            entidadBancariaService
                    .getAll()
                    .then(function (datos) {
                        $scope.entidadBancarias = datos.data;
                        var data = datos.data;
                        $scope.tableEntidades = new NgTableParams({
                            page: 1,
                            count: ($window.innerHeight > 734) ? 22 : 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.entidadBancarias;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }});
                    });
        }

        function modificarEntidad(entidad) {
            ngDialog.open({
                template: 'views/banco/modal-modificar-entidad.html',
                className: 'ngdialog-theme-flat',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {entidad: entidad}
            });
        }

        $scope.$on('reloadEntidades', function () {
            entidadBancariaService
                    .getAll()
                    .then(function (datos) {
                        $scope.entidadBancarias = datos.data;
                        $scope.tableEntidades.reload();
                    });
        });

    }

})();