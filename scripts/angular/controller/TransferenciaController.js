miAppHome.controller('TransferenciaController', function ($scope, $state, transferenciaService, NgTableParams) {

    $scope.listaHoyTransferencias = function () {
        $transferencias = transferenciaService.getDaily();
        $transferencias.then(function (datos) {
            console.log(datos);
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
            console.log(datos);
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
});

