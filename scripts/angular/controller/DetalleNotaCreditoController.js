miAppHome.controller('DetalleNotaCreditoController', function ($scope, $timeout, $rootScope, notaCreditoService, ngDialog, toaster, $state, $stateParams, detalleNotaCreditoService, NgTableParams) {

    $scope.busq = null;
    
    $scope.backToNota = function(){
        var idNota = $stateParams.idNota;
        $state.go('detalle_nota_credito',{idNota:idNota});
    };

    $scope.buscarProductoOnFactura = function (barcode) {
        $busq = detalleNotaCreditoService.getProductoOnFactura(barcode);
        $busq.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.open({
                    template: 'views/nota_credito/modal-busqueda-producto.html',
                    className: 'ngdialog-theme-lg ngdialog-theme-custom',
                    showClose: false,
                    controller: 'DetalleNotaCreditoController',
                    closeByDocument: false,
                    closeByEscape: false,
                    data: {productos: datos.data}
                });
            } else {
                toaster.pop({
                    type: 'error',
                    title: '¡Error!',
                    body: 'No se han encontrado productos.',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.panelDevolverItem = function (item) {
        ngDialog.open({
            template: 'views/nota_credito/modal-cargar-cantidad-devolver.html',
            className: 'ngdialog-theme-sm ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {detalle: item}
        });
    };


    $scope.listaDetalleNotaCredito = function () {
        var idNota = $stateParams.idNota;
        $scope.detallesNotaCredito = "";
        $list = detalleNotaCreditoService.getNotaCreditoDetail(idNota);
        $list.then(function (datos) {
            if (datos.status === 200) {
                $scope.detallesNotaCredito = datos.data;
                var data = datos.data;
                $scope.tableDetallesNotaCredito = new NgTableParams({
                    page: 1,
                    count: 5
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.detallesNotaCredito;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }
                });
            }
        });
    };


    $scope.$on('updateDetalleNotaCredito2', function (event, object) {
        var idNota = $stateParams.idNota;
        $list = detalleNotaCreditoService.getNotaCreditoDetail(idNota);
        $list.then(function (datos) {
            $scope.detallesNotaCredito = datos.data;
            $scope.tableDetallesNotaCredito.reload();
            $rootScope.$broadcast('updateMontoNota', {});
        });
    });

    $scope.$on('updateDetalleNotaCredito', function (event, object) {
        $scope.listaDetalleNotaCredito();
    });

    $scope.eliminarDetalleNota = function (detalle) {
        ngDialog.open({
            template: 'views/nota_credito/modal-eliminar-detalle-nota.html',
            className: 'ngdialog-theme-sm ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {detalle: detalle}
        });
    };

    $scope.modificarDetalleNota = function (detalle) {        
        ngDialog.open({
            template: 'views/nota_credito/modal-modificar-detalle-nota.html',
            className: 'ngdialog-theme-sm ngdialog-theme-custom',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {detalle: detalle}
        });
    };

});