(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('MarcaController', MarcaController);

    MarcaController.$inject = ['$scope', 'BaseURL', 'ngDialog', 'cookieService', '$state', 'toaster', '$http', 'NgTableParams', '$timeout', '_marcaService'];

    function MarcaController($scope, BaseURL, ngDialog, cookieService, $state, toaster, $http, NgTableParams, $timeout, _marcaService) {
        var vm = this;
        /*VARIABLES*/
        vm._marcas = {
            "idMarca": null,
            "nombreMarca": "",
            "fechaCreacion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        };
        vm.editMarca = null;
        vm.panelMarcaEdit = true;
        /*METODOS*/
        vm.agregarMarca = agregarMarca;
        vm.eliminarMarca = eliminarMarca;
        vm.getMarca = getMarca;
        vm.hidePanelMarca = hidePanelMarca;
        vm.listaMarcas = listaMarcas;
        vm.modificarMarca = modificarMarca;

        function agregarMarca(marca) {
            _marcaService.addMarca(marca)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Marca agregada con exito.',
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

        function eliminarMarca(marca) {
            ngDialog.open({
                template: 'views/marcas/modal-confirmar-eliminar-marca.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {marca: marca}
            });
        }

        function getMarca(val) {
            var uri = BaseURL + 'marcas/searchText';
            var token = cookieService.get('token');
            return token.then(function (data) {
                return $http({
                    url: uri,
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + data
                    },
                    params: {
                        'text': val
                    }
                }).then(function (response) {
                    return response.data.map(function (item) {
                        return item;
                    });
                });
            });
        }

        function hidePanelMarca(marca) {
            vm.editMarca = marca;
            vm.panelMarcaEdit = false;
        }

        function listaMarcas() {
            $scope.marcas = "";
            _marcaService
                    .getListaMarcas()
                    .then(function (datos) {
                        var data = datos.data;
                        if (datos.status === 200) {
                            $scope.marcas = datos.data;
                        }
                        $scope.tableMarcas = new NgTableParams({
                            page: 1,
                            count: 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.marcas;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }});
                    });
        }

        function modificarMarca(marca) {
            ngDialog.open({
                template: 'views/marcas/modal-confirmar-modificar-marca.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {marca: marca}
            });
        }

        $scope.$on('reloadMarcas', function () {
            vm.panelMarcaEdit = true;
            _marcaService
                    .getListaMarcas()
                    .then(function (datos) {
                        $scope.marcas = datos.data;
                        $scope.tableMarcas.reload();
                    });
        });

    }

})();

