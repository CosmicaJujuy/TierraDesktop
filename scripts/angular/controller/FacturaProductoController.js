(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('FacturaProductoController', FacturaProductoController);

    FacturaProductoController.$inject = ['$scope', 'BaseURL', '$http', 'cookieService', 'ngDialog', 'NgTableParams', 'toaster',
        '$timeout', 'facturaProductoService', '$state', '$stateParams', '$window'];

    function FacturaProductoController($scope, BaseURL, $http, cookieService, ngDialog, NgTableParams, toaster,
            $timeout, facturaProductoService, $state, $stateParams, $window) {
        var vm = this;
        /*VARIABLES*/
        vm._facturaProducto = {
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
        /*METODOS*/
        vm.actualizarFacturaProducto = actualizarFacturaProducto;
        vm.agregarFacturaProducto = agregarFacturaProducto;
        vm.agregarProductoFactura = agregarProductoFactura;
        vm.confirmarActualizarFacturaProducto = confirmarActualizarFacturaProducto;
        vm.confirmarFinalizarCargaFactura = confirmarFinalizarCargaFactura;
        vm.detallesFacturaProducto = detallesFacturaProducto;
        vm.finalizarCargaFactura = finalizarCargaFactura;
        vm.listaFacturaProducto = listaFacturaProducto;

        function actualizarFacturaProducto() {
            facturaProductoService
                    .update($scope.ngDialogData.toUpdate)
                    .then(function (datos) {
                        ngDialog.closeAll();
                        if (datos.status === 200) {
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

        function agregarFacturaProducto(facturaProducto) {
            facturaProductoService
                    .add(facturaProducto)
                    .then(function (datos) {
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
        }

        function agregarProductoFactura() {
            $state.go('add_producto_factura', {"idFactura": $stateParams.idFactura});
        }

        function confirmarActualizarFacturaProducto(toUpdate) {
            ngDialog.open({
                template: 'views/factura_producto/modal-confirmar-actualizacion.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'FacturaProductoController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {
                    'toUpdate': toUpdate
                }
            });
        }

        function confirmarFinalizarCargaFactura() {
            ngDialog.open({
                template: 'views/factura_producto/modal-confirmar-finalizar-carga-factura.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'FacturaProductoController as vm',
                closeByDocument: false,
                closeByEscape: true
            });
        }

        function detallesFacturaProducto() {
            facturaProductoService
                    .detail($stateParams.idFactura)
                    .then(function (datos) {
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
        }

        function finalizarCargaFactura() {
            facturaProductoService
                    .finish($stateParams.idFactura)
                    .then(function (datos) {
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
        }

        function listaFacturaProducto() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableFacturaProductos = new NgTableParams({
                    page: 1,
                    count: ($window.innerHeight > 734) ? ($state.current.name === 'distribucion' ? 20 : 22) : ($state.current.name === 'distribucion' ? 11 : 13)
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
        }

    }

})();