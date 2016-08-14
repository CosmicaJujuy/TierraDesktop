miAppHome.controller('ReservaController', function (
        $scope,
        $state,
        reservaService,
        $http,
        cookieService,
        NgTableParams,
        BaseURL) {

    $scope.nuevaReserva = {
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
    $scope.totalReservas = 0;
    $scope.totalReservasMensuales = 0;

    $scope.listaReservasDiaria = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableReservasDiaria = new NgTableParams({
                page: 1,
                count: 13
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
    };

    $scope.listaReservasMensual = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableReservasMensual = new NgTableParams({
                page: 1,
                count: 13
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
    };

    $scope.agregarReserva = function (reserva) {
        $reserva = reservaService.add(reserva);
        $reserva.then(function (datos) {
            if (datos.status === 200) {
                $state.transitionTo('reserva', {idFactura: datos.data.msg});
            }
        });
    };

});