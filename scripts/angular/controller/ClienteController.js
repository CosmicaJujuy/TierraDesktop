(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('ClienteController', ClienteController);

    ClienteController.$inject = ['$scope', 'clienteService'];

    function ClienteController($scope, clienteService) {
        var vm = this;
        vm.clientes = [];
        vm.listaClientes = listaClientes;

        function listaClientes() {
            clienteService
                    .getAll()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            vm.clientes = datos.data;
                        }
                    });
        }

    }

})();
