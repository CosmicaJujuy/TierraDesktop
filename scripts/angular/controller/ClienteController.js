miAppHome.controller('ClienteController', function ($scope, clienteService) {

    $scope.listaClientes = function () {
        $list = clienteService.getAll();
        $list.then(function (datos) {
            if (datos.status === 200) {
                $scope.clientes = datos.data;
            }
        });
    };

});

