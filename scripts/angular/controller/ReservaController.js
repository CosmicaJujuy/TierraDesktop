(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('ReservaController', ReservaController);

    ReservaController.$inject = ['$scope', '$state', 'reservaService', '$http', 'cookieService', 'NgTableParams', 'BaseURL'];

    function ReservaController($scope, $state, reservaService, $http, cookieService, NgTableParams, BaseURL) {
        var vm = this;
        /*VARIBLAES*/
        vm.nuevaReserva = {
            "idFactura": null,
            "cliente": null,
            "estado": "RESERVADO",
            "idVendedor": null,
            "fechaCreacion": null,
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null,
            "total": null,
            "numeracion": null,
            "idSucursal": null
        };
        /*METODOS*/
        vm.agregarReserva = agregarReserva;
        vm.listaReservasDiaria = listaReservasDiaria;
        vm.listaReservasMensual = listaReservasMensual;

        function agregarReserva(reserva) {
            reservaService
                    .add(reserva)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $state.transitionTo('reserva', {idFactura: datos.data.msg});
                        }
                    });
        }

        function listaReservasDiaria() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableReservasDiaria = new NgTableParams({
                    page: 1,
                    count: 12
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "reserva/day/paged",
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

        function listaReservasMensual() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableReservasMensual = new NgTableParams({
                    page: 1,
                    count: 12
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "reserva/month/paged",
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