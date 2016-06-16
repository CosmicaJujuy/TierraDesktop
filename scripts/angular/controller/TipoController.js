/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('TipoController', function ($scope, $state, toaster, $timeout, _tipoService) {

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

    $scope.eliminarTipo = function () {
        $promesa = _tipoService.deleteTipo($scope.__tipo);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Tipo eliminado con exito.',
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

    $scope.seleccionarTipo = function (tipo) {
        $scope.__tipo = tipo;
    };

    $scope._modificarTipo = function (tipo) {
        $promesa = _tipoService.updateTipo(tipo);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Tipo modificado con exito.',
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

});


