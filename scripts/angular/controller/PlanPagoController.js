/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('PlanPagoController', function ($scope, ngDialog, $timeout, toaster, $state, NgTableParams, planPagoService) {

    $scope._planPago = {
        "idPlanesPago": null,
        "tarjeta": null,
        "nombrePlanesPago": "",
        "cuotasPlanesPago": null,
        "fechaInicioPlanes": "",
        "fechaFinalizacionPlanes": null,
        "porcentajeInterez": null,
        "fechaCierre": "",
        "estadoPlanes": true,
        "fechaCreacion": "",
        "fechaModificacion": "",
        "usuarioCreacion": null,
        "usuarioMoficacion": null
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: null,
        startingDay: 1
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.open = function () {
        $scope.popup.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };
    $scope.popup = {
        opened: false
    };

    $scope.listaPlanPago = function () {
        $scope.planes = "";
        $promesa = planPagoService.getAll();
        $promesa.then(function (datos) {
            $scope.planes = datos.data;
            var data = datos.data;
            $scope.tablePlanes = new NgTableParams({
                page: 1,
                count: 13
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.planes;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $scope.seleccionarPlanPago = function (planPago) {
        $scope.planSeleccionado = planPago;
        $scope.planSeleccionado.fechaFinalizacionPlanes = new Date(planPago.fechaFinalizacionPlanes);
        $scope.planSeleccionado.fechaInicioPlanes = new Date(planPago.fechaInicioPlanes);
    };

    $scope.panelPlanEdit = true;
    $scope.hidePanelPlan = function (planes) {
        if (angular.isDate(planes.fechaInicioPlanes) && angular.isDate(planes.fechaFinalizacionPlanes)) {
            $scope.editPlanPago = planes;
            $scope.panelPlanEdit = false;
        } else {
            var splited = planes.fechaInicioPlanes.split("-");
            var splited2 = planes.fechaFinalizacionPlanes.split("-");
            var dateInicio = new Date(splited[0], splited[1] - 1, splited[2]);
            var dateFinalizacion = new Date(splited2[0], splited2[1] - 1, splited2[2]);
            $scope.editPlanPago = planes;
            $scope.editPlanPago.fechaInicioPlanes = dateInicio;
            $scope.editPlanPago.fechaFinalizacionPlanes = dateFinalizacion;
            $scope.panelPlanEdit = false;
        }
    };

    $scope.agregarPlan = function (planPago) {
        $promesa = planPagoService.add(planPago);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Plan de pago agregado exitosamente',
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

    $scope.modificarPlan = function (planPago) {
        ngDialog.open({
            template: 'views/planes/modal-confirmar-modificar-plan.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {planPago: planPago}
        });
    };

    $scope.eliminarPlan = function (planPago) {
        ngDialog.open({
            template: 'views/planes/modal-confirmar-eliminar-plan.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {planPago: planPago}
        });
    };

    $scope.$on('reloadPlanes', function () {
        $reload = planPagoService.getAll();
        $reload.then(function (datos) {
            $scope.panelPlanEdit = true;
            $scope.planes = datos.data;
            $scope.tablePlanes.reload();
        });
    });
});

