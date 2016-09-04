(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('MedioPagoController', MedioPagoController);
    MedioPagoController.$inject = ['$scope', 'medioPagoService'];

    function MedioPagoController($scope, medioPagoService) {
        var vm = this;
        vm._medioPago = {
            "idMedioPago": null,
            "nombrePago": "",
            "estado": true,
            "fechaCreacion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        };
        vm.listaMedioPago = listaMedioPago;

        function listaMedioPago() {
            $scope.medioPagos = "";
            medioPagoService
                    .getAll()
                    .then(function (datos) {
                        datos.data.shift();
                        $scope.medioPagos = datos.data;
                    });
        }
    }

})();

