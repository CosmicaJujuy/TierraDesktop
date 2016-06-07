/**
 * Controlador de Proveedores encargado de procesar datos para el objeto Proveedor
 * en la base de datos
 * @param {type} param1
 * @param {type} param2
 */
miAppHome.controller('ProveedorController', function ($scope, cookieService, NgTableParams, toaster, $state, $stateParams, $rootScope, $http, $timeout, $cookies, _proveedorService) {

    /**
     * Modelo de objeto Proveedor utilizado para agregar nuevos proveedores
     * a la base de datos.
     */
    $scope._proveedor = {
        "idProveedor": null,
        "nombreProveedor": "",
        "cuitProveedor": "",
        "direccionProveedor": "",
        "paisProveedor": "",
        "provinciaProveedor": "",
        "localidadProveedor": "",
        "codigoPostal": "",
        "telefonoProveedor": "",
        "emailProveedor": "",
        "estadoProveedor": true,
        "usuarioCreacion": null,
        "usuarioModificacion": null,
        "fechaCreacion": "",
        "fechaModificacion": null
    };

    /**
     * Funcion lista de proveedores, encarga de mostrar todos los proveedorers
     * disponibles en la base de datos.
     * @returns {undefined}
     */
    $scope.listaProveedores = function () {
        $scope.proveedores = "";
        $promesa = _proveedorService.getAll();
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                $scope.proveedores = datos.data;
                var data = datos;
                $scope.tableProveedores = new NgTableParams({
                    page: 1,
                    count: 10
                }, {
                    total: data.length,
                    getData: function (params) {
                        data = $scope.proveedores;
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

    /**
     * Funcion agregar Proveedor, encargada de agregar un nuevo proveedor
     * a la base de datos.
     * @param {type} proveedor objeto recibido desde la vista.
     * @returns {undefined}
     */
    $scope.agrearProveedor = function (proveedor) {
        $promesa = _proveedorService.add(proveedor);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Proveedor agregado exitosamente',
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
     * Funcion eliminar Proveedor, encargada de deshabilitar un proveedor en la 
     * base de datos.
     * 
     * @returns {undefined}
     */
    $scope.eliminarProveedor = function () {
        $promesa = _proveedorService.delete($scope.__proveedor);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Proveedor eliminado exitosamente',
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
     * Funcion seleccionar, selecciona un Proveedor desde una tabla en la vista
     * @param {type} proveedor objeto proveedor recibido desde la vista.
     * @returns {undefined}
     */
    $scope.seleccionarProveedor = function (proveedor) {
        $scope.__proveedor = proveedor;
    };


    /**
     * Funcion modificar Proveedor, encargadad de modificar un objeto en la base
     * de datos.
     * @param {type} proveedor
     * @returns {undefined}
     */
    $scope._modificarProveedor = function (proveedor) {
        $promesa = _proveedorService.update(proveedor);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Proveedor modificado exitosamente',
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
     * Funcion buscar proveedor, busca un proveedor apartir del id del proveedor
     * @returns {undefined}
     */
    $scope.buscarProveedor = function () {
        /* id proveniente de la url */
        var idProveedor = $stateParams.idProveedor;
        $promesa = _proveedorService.searchById(idProveedor);
        $promesa.then(function (datos) {
            if (datos.status !== 200 || datos.data.estadoProveedor === false) {
                $state.go('^.proveedor');
            } else {
                $scope.foundProveedor = datos.data;
            }
        });
    };


    /**
     * metodo para la busqueda dinamica de proveedores
     * @param {type} val string para bsucar proveedores
     * @returns {unresolved}
     */
    $scope.getProveedor = function (val) {
        var uri = 'https://tierradecoloresapi.herokuapp.com/proveedor/searchText';
        var token = cookieService.get('token');
        return token.then(function (data) {
            return $http({
                url: uri,
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + data
                },
                params: {
                    'text': val
                }
            }).then(function (response) {
                return response.data.map(function (item) {
                    console.log(item);
                    return item;
                });
            });
        });
    };

});

