/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('PlanPagoController', function ($scope, $timeout, toaster, $state, NgTableParams, planPagoService) {

    $scope._planPago = {
        "idPlanesPago": null,
        "tarjeta": {
            "idTarjeta": null,
            "entidadBancaria": {
                "idEntidadMonetaria": null,
                "nombreEntidad": "",
                "direccionEntidad": "",
                "telefonoEntidad": "",
                "estadoEntidad": true,
                "fechaCreaciion": "",
                "fechaModificacion": null,
                "usuarioCreacion": null,
                "usuarioModificacion": null
            },
            "medioPago": {
                "idMedioPago": null,
                "nombrePago": "",
                "estado": true,
                "fechaCreacion": "",
                "fechaModificacion": null,
                "usuarioCreacion": null,
                "usuarioModificacion": null
            },
            "nombreTarjeta": "",
            "estadoTarjeta": true,
            "fechaCreacion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        },
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
        $promesa = planPagoService.update(planPago);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                planPagoService.getAll().then(function (datos) {
                    $scope.planes = datos.data;
                    $scope.tablePlanes.reload();
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Plan de pago modificado exitosamente',
                    showCloseButton: false
                });
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

    $scope.eliminarPlan = function () {
        $promesa = planPagoService.delete($scope.planSeleccionado);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                planPagoService.getAll().then(function (datos) {
                    $scope.planes = datos.data;
                    $scope.tablePlanes.reload();
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Plan de pago eliminado exitosamente',
                    showCloseButton: false
                });
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

