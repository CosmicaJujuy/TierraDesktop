/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('TipoController', function ($scope, ngDialog, $state, toaster, $timeout, _tipoService, NgTableParams) {

    $scope._tipo = {
        "idTipo": null,
        "nombreTipo": "",
        "usuarioCreacion": null,
        "usuarioModificacion": null,
        "fechaCreacion": "",
        "fechaModificacion": null
    };

    $scope.listaTipo = function () {
        $scope.tipos = "";
        $promesa = _tipoService.getListaTipo();
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                $scope.tipos = datos.data;
                var data = datos.data;
                $scope.tableTipos = new NgTableParams({
                    page: 1,
                    count: 13
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.tipos;
                        params.total(data.length);
                        if (params.total() <= ((params.page() - 1) * params.count())) {
                            params.page(1);
                        }
                        return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    }});
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: "¡Op's algo paso!, comunicate con el administrador.",
                    showCloseButton: false
                });
            }
        });
    };

    $scope.agregarTipo = function (tipo) {
        $promesa = _tipoService.addTipo(tipo);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Tipo agregado con exito.',
                    showCloseButton: false
                });
                $timeout(function timer() {
                    $state.go($state.current, {}, {reload: true});
                }, 1000);
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: "¡Op's algo paso!, comunicate con el administrador.",
                    showCloseButton: false
                });
            }
        });
    };

    $scope.eliminarTipo = function (tipo) {
        ngDialog.open({
            template: 'views/tipo/modal-confirmar-eliminar-tipo.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {tipo: tipo}
        });
    };

    $scope.seleccionarTipo = function (tipo) {
        $scope.__tipo = tipo;
    };

    $scope.panelTipoEdit = true;
    $scope.hidePanelTipo = function (tipo) {
        $scope.panelTipoEdit = false;
        $scope.editTipo = tipo;
    };

    $scope.modificarTipo = function (tipo) {
        ngDialog.open({
            template: 'views/tipo/modal-confirmar-modificar-tipo.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: true,
            data: {tipo: tipo}
        });
    };

    $scope.$on('reloadTipos', function () {
        $promesa = _tipoService.getListaTipo();
        $promesa.then(function (datos) {
            $scope.panelTipoEdit = true;
            $scope.tipos = datos.data;
            $scope.tableTipos.reload();
        });
    });
});


