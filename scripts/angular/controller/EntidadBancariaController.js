/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('EntidadBancariaController', function ($scope, $timeout, $state, NgTableParams, toaster, $route, entidadBancariaService) {

    /**
     * Objeto modelo para entidad bancaria
     */
    $scope._entidadBancaria = {
        "idEntidadMonetaria": null,
        "nombreEntidad": "",
        "direccionEntidad": "",
        "telefonoEntidad": "",
        "estadoEntidad": true,
        "fechaCreaciion": "",
        "fechaModificacion": null,
        "usuarioCreacion": null,
        "usuarioModificacion": null
    };

    /**
     * funcion para mostrar una lista de entidades bancarias.
     * @returns {undefined}
     */
    $scope.listaEntidadBancaria = function () {
        $scope.entidadBancarias = "";
        $promesa = entidadBancariaService.getAll();
        $promesa.then(function (datos) {
            $scope.entidadBancarias = datos.data;
            var data = datos.data;
            $scope.tableEntidades = new NgTableParams({
                page: 1,
                count: 8
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.entidadBancarias;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    /**
     * funcion para seleccionar una entidad de la tabla de entidades.
     * @param {type} entidad objeto entidad seleccionado
     * @returns {undefined}
     */
    $scope.seleccionarEntidad = function (entidad) {
        $scope.entidadSeleccionada = entidad;
    };

    /**
     * funcion agregar una nueva entidad
     * @param {type} entidad objeto entidad recibido desde la vista 
     * @returns {undefined}
     */
    $scope.agregarEntidad = function (entidad) {
        $promesa = entidadBancariaService.add(entidad);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Entidad agregada con exito.',
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

    /**
     * funcion modificar entidad de la lista de entidades
     * @param {type} entidad objeto seleccionado desde la vista
     * @returns {undefined}
     */
    $scope.modificarEntidad = function (entidad) {
        $promesa = entidadBancariaService.update(entidad);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                entidadBancariaService.getAll().then(function (datos) {
                    $scope.entidadBancarias = datos.data;
                    $scope.tableEntidades.reload();
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Entidad modificada con exito.',
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

    /**
     * funcion eliminar entidad bancaria, pasa a estado "false" en la base de
     *  datos (borrado logico)
     * @returns {undefined}
     */
    $scope.eliminarEntidad = function () {
        $promesa = entidadBancariaService.delete($scope.entidadSeleccionada);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                entidadBancariaService.getAll().then(function (datos) {
                    $scope.entidadBancarias = datos.data;
                    $scope.tableEntidades.reload();
                });
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Entidad eliminada con exito.',
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

