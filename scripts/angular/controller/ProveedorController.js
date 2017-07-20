(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('ProveedorController', ProveedorController);

    ProveedorController.$inject = ['$scope', 'BaseURL', 'ngDialog', 'cookieService', 'NgTableParams', 'toaster', '$state', '$stateParams',
        '$http', '$timeout', '_proveedorService', '$window'];

    function ProveedorController($scope, BaseURL, ngDialog, cookieService, NgTableParams, toaster, $state, $stateParams,
            $http, $timeout, _proveedorService, $window) {
        var vm = this;
        /*VARIABLES*/
        vm._proveedor = {
            "idProveedor": null,
            "nombreProveedor": "",
            "cuitProveedor": "",
            "direccionProveedor": "",
            "paisProveedor": "",
            "provinciaProveedor": "",
            "localidadProveedor": "",
            "codigoPostal": "",
            "telefonoProveedor": "",
            "emailProveedor": "",
            "estadoProveedor": true,
            "usuarioCreacion": null,
            "usuarioModificacion": null,
            "fechaCreacion": "",
            "fechaModificacion": null
        };
        /*METODOS*/
        vm.agregarProveedor = agregarProveedor;
        vm.buscarProveedor = buscarProveedor;
        vm.eliminarProveedor = eliminarProveedor;
        vm.getProveedor = getProveedor;
        vm.listaProveedores = listaProveedores;
        vm.modificarProveedor = modificarProveedor;

        function agregarProveedor(proveedor) {
            _proveedorService
                    .add(proveedor)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Proveedor agregado exitosamente',
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

        function buscarProveedor() {
            _proveedorService
                    .searchById($stateParams.idProveedor)
                    .then(function (datos) {
                        if (datos.status !== 200 || datos.data.estadoProveedor === false) {
                            $state.go('proveedores');
                        } else {
                            $scope.foundProveedor = datos.data;
                        }
                    });
        }

        function eliminarProveedor(proveedor) {
            ngDialog.open({
                template: 'views/proveedor/modal-confirmar-eliminar-proveedor.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {proveedor: proveedor}
            });
        }

        function getProveedor(val) {
            var uri = BaseURL + 'proveedor/searchText';
            var token = cookieService.get('token');
            return token.then(function (data) {
                return $http({
                    ignoreLoadingBar: true,
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

        function listaProveedores() {
            $scope.proveedores = "";
            _proveedorService
                    .getAll()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.proveedores = datos.data;
                            var data = datos;
                            $scope.tableProveedores = new NgTableParams({
                                page: 1,
                                count: ($window.innerHeight > 734) ? 22 : 13
                            }, {
                                total: data.length,
                                getData: function (params) {
                                    data = $scope.proveedores;
                                    params.total(data.length);
                                    if (params.total() <= ((params.page() - 1) * params.count())) {
                                        params.page(1);
                                    }
                                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                }});
                        }
                    });
        }

        function modificarProveedor(proveedor) {
            ngDialog.open({
                template: 'views/proveedor/modal-modificar-proveedor.html',
                className: 'ngdialog-theme-flat',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {proveedor: proveedor}
            });
        }

        $scope.$on('reloadProveedores', function () {
            if ($state.current.name === 'proveedor_detalle') {
                $timeout(function timer() {
                    $state.go($state.current, {}, {reload: true});
                }, 1000);
            } else {
                _proveedorService
                        .getAll()
                        .then(function (datos) {
                            if (datos.status === 200) {
                                $scope.proveedores = datos.data;
                                $scope.tableProveedores.reload();
                            }
                        });
            }
        });

    }

})();