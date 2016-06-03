/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('MedioPagoController', function ($scope, medioPagoService) {

    $scope._medioPago = {
        "idMedioPago": null,
        "nombrePago": "",
        "estado": true,
        "fechaCreacion": "",
        "fechaModificacion": null,
        "usuarioCreacion": null,
        "usuarioModificacion": null
    };

    $scope.listaMedioPago = function () {
        $scope.medioPagos = "";
        $promesa = medioPagoService.getAll();
        $promesa.then(function (datos) {
            datos.data.shift();
            $scope.medioPagos = datos.data;
        });
    };

});

