miAppHome.controller('TransferenciaController', function ($scope, $state, transferenciaService) {

    $scope.listaTransferencias = function () {
        $transferencias = transferenciaService.getAll();
        $transferencias.then(function (datos) {
            console.log(datos);
        });
    };
});

