miAppHome.controller('NotaCreditoController', function (toaster, $scope, $state, $stateParams, notaCreditoService, NgTableParams) {

    $scope._notaCredito = {
        estadoUso: null,
        fechaCreacion: null,
        fechaModificacion: null,
        idCliente: null,
        idNotaCredito: null,
        montoTotal: 0,
        numero: null,
        usuarioCreacion: null,
        usuarioModificacion: null
    };

    $scope.listaNotaCredito = function () {
        $notas = notaCreditoService.getAll();
        $notas.then(function (datos) {
            if (datos.status === 200) {
                console.log(datos);
                $scope.notasCredito = datos.data;
                var data = datos;
                $scope.tableNotaCredito = new NgTableParams({
                    page: 1,
                    count: 13
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.notasCredito;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            }
        });
    };

    $scope.detalleNotaCredito = function () {
        var idNota = $stateParams.idNota;
        $detalle = notaCreditoService.getById(idNota);
        $detalle.then(function (datos) {
            if (datos.status === 200) {
                $scope.notaCreditoDetalle = datos.data;
            }
        });
    };

    $scope.agregarNotaCredito = function (nota) {
        var codigo = Math.floor((Math.random() * 99999) + 10000);
        nota.numero = codigo.toString();
        $add = notaCreditoService.add(nota);
        $add.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Nota de credito agregada con exito.',
                    showCloseButton: false
                });
                $state.transitionTo('detalle_nota_credito', {idNota: datos.data.msg});
            }
        });
    };
});