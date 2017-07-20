(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('TipoController', TipoController);

    TipoController.$inject = ['$scope', 'ngDialog', '$state', 'toaster', '$timeout', '_tipoService', 'NgTableParams', '$window'];

    function TipoController($scope, ngDialog, $state, toaster, $timeout, _tipoService, NgTableParams, $window) {
        var vm = this;
        /*VARIABLES*/
        vm._tipo = {
            "idTipo": null,
            "nombreTipo": "",
            "usuarioCreacion": null,
            "usuarioModificacion": null,
            "fechaCreacion": "",
            "fechaModificacion": null
        };
        vm.editTipo = null;
        vm.panelTipoEdit = true;
        /*METODOS*/
        vm.agregarTipo = agregarTipo;
        vm.eliminarTipo = eliminarTipo;
        vm.hidePanelTipo = hidePanelTipo;
        vm.listaTipo = listaTipo;
        vm.modificarTipo = modificarTipo;

        function agregarTipo(tipo) {
            _tipoService
                    .addTipo(tipo)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Tipo agregado con exito.',
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

        function eliminarTipo(tipo) {
            ngDialog.open({
                template: 'views/tipo/modal-confirmar-eliminar-tipo.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {tipo: tipo}
            });
        }

        function hidePanelTipo(tipo) {
            vm.panelTipoEdit = false;
            vm.editTipo = tipo;
        }

        function listaTipo() {
            $scope.tipos = "";
            _tipoService
                    .getListaTipo()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.tipos = datos.data;
                            var data = datos.data;
                            $scope.tableTipos = new NgTableParams({
                                page: 1,
                                count: ($window.innerHeight > 734) ? 22 : 13
                            }, {
                                total: data.length,
                                getData: function (params) {
                                    data = $scope.tipos;
                                    params.total(data.length);
                                    if (params.total() <= ((params.page() - 1) * params.count())) {
                                        params.page(1);
                                    }
                                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                }});
                        }
                    });
        }

        function modificarTipo(tipo) {
            ngDialog.open({
                template: 'views/tipo/modal-confirmar-modificar-tipo.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {tipo: tipo}
            });
        }

        $scope.$on('reloadTipos', function () {
            _tipoService
                    .getListaTipo()
                    .then(function (datos) {
                        vm.panelTipoEdit = true;
                        $scope.tipos = datos.data;
                        $scope.tableTipos.reload();
                    });
        });

    }

})();