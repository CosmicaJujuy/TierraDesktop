miAppHome.controller('TransferenciaController', function ($scope, $state, $stateParams, transferenciaService, NgTableParams) {

    $scope._transferencia = {
        estadoPedido: null,
        fechaCreacion: null,
        fechaModificacion: null,
        idTransferencia: null,
        sucursalPedido: null,
        sucursalRespuesta: null,
        usuarioCreacion: null,
        usuarioModificacion: null
    };

    $scope.listaHoyTransferencias = function () {
        $transferencias = transferenciaService.getDaily();
        $transferencias.then(function (datos) {
            var data = datos.data;
            $scope.transferenciasHoy = datos.data;
            $scope.tableHoyTransferencias = new NgTableParams({
                page: 1,
                count: 12
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.transferenciasHoy;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.listaMesTransferencias = function () {
        $transferencias = transferenciaService.getMonth();
        $transferencias.then(function (datos) {
            var data = datos.data;
            $scope.transferenciasMoth = datos.data;
            $scope.tableMesTransferencias = new NgTableParams({
                page: 1,
                count: 12
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.transferenciasMoth;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.agregarTransferencia = function () {
        $add = transferenciaService.add($scope._transferencia);
        $add.then(function (datos) {
            console.log(datos);
            console.log($scope._transferencia);
            if (datos.status === 200) {
                $state.go('transferencias_detalle', {idTransferencia: datos.data});
            }
        });
    };

    $scope.datosTransferencia = function () {
        console.log($state.current);
        console.log($stateParams.idTransferencia);
    };
});

