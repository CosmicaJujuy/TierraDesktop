miAppHome.controller('ReservaController', function ($scope, $state, $stateParams, reservaService, facturaService, NgTableParams, $rootScope) {

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
        $diaria = reservaService.getDay();
        $diaria.then(function (datos) {
            if (datos.status === 200) {
                $scope.reservasDiarias = datos.data;
                var data = datos.data;
                angular.forEach(data, function (value, key) {
                    $scope.totalReservas = parseFloat($scope.totalReservas) + parseFloat(value.total);
                });
                $scope.tableReservasDiaria = new NgTableParams({
                    page: 1,
                    count: 5
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.reservasDiarias;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.listaReservasMensual = function () {
        $mensual = reservaService.getMonth();
        $mensual.then(function (datos) {
            if (datos.status === 200) {
                $scope.reservasMensuales = datos.data;
                var data = datos.data;
                angular.forEach(data, function (value, key) {
                    $scope.totalReservasMensuales = parseFloat($scope.totalReservasMensuales) + parseFloat(value.total);
                });
                $scope.tableReservasDiaria = new NgTableParams({
                    page: 1,
                    count: 5
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.reservasMensuales;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.agregarReserva = function (reserva) {
        $reserva = reservaService.add(reserva);
        $reserva.then(function (datos) {
            if (datos.status === 200) {
                $state.transitionTo('home.reserva', {idFactura: datos.data.msg});
            }
        });
    };

});