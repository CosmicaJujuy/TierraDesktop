(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('PlanPagoController', PlanPagoController);

    PlanPagoController.$inject = ['$scope', 'ngDialog', '$timeout', 'toaster', '$state', 'NgTableParams', 'planPagoService', '$window'];

    function PlanPagoController($scope, ngDialog, $timeout, toaster, $state, NgTableParams, planPagoService, $window) {
        var vm = this;
        /*VARIBLAES*/
        vm._planPago = {
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
        vm.editPlanPag = null;
        vm.panelPlanEdit = true;
        /*METODOS*/
        vm.agregarPlan = agregarPlan;
        vm.eliminarPlan = eliminarPlan;
        vm.hidePanelPlan = hidePanelPlan;
        vm.listaPlanPago = listaPlanPago;
        vm.modificarPlan = modificarPlan;

        function agregarPlan(planPago) {
            planPagoService
                    .add(planPago)
                    .then(function (datos) {
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
        }

        function eliminarPlan(planPago) {
            ngDialog.open({
                template: 'views/planes/modal-confirmar-eliminar-plan.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {planPago: planPago}
            });
        }

        function hidePanelPlan(planes) {
            if (angular.isDate(planes.fechaInicioPlanes) && angular.isDate(planes.fechaFinalizacionPlanes)) {
                vm.editPlanPago = planes;
                vm.panelPlanEdit = false;
            } else {
                var splited = planes.fechaInicioPlanes.split("-");
                var splited2 = planes.fechaFinalizacionPlanes.split("-");
                var dateInicio = new Date(splited[0], splited[1] - 1, splited[2]);
                var dateFinalizacion = new Date(splited2[0], splited2[1] - 1, splited2[2]);
                vm.editPlanPago = planes;
                vm.editPlanPago.fechaInicioPlanes = dateInicio;
                vm.editPlanPago.fechaFinalizacionPlanes = dateFinalizacion;
                vm.panelPlanEdit = false;
            }
        }

        function listaPlanPago() {
            $scope.planes = "";
            planPagoService
                    .getAll()
                    .then(function (datos) {
                        $scope.planes = datos.data;
                        var data = datos.data;
                        $scope.tablePlanes = new NgTableParams({
                            page: 1,
                            count: ($window.innerHeight > 734) ? 22 : 13
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
        }

        function modificarPlan(planPago) {
            ngDialog.open({
                template: 'views/planes/modal-confirmar-modificar-plan.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {planPago: planPago}
            });
        }

        $scope.$on('reloadPlanes', function () {
            planPagoService
                    .getAll()
                    .then(function (datos) {
                        vm.panelPlanEdit = true;
                        $scope.planes = datos.data;
                        $scope.tablePlanes.reload();
                    });
        });

    }

})();