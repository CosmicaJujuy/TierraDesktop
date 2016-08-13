/**
 * Controlador Marca encargador de procesar datos referentes a las marcas en la
 * base de datos.
 * @param {type} param1
 * @param {type} param2
 */
miAppHome.controller('MarcaController', function (
        $scope,
        BaseURL,
        ngDialog,
        cookieService,
        $state,
        toaster,
        $http,
        NgTableParams,
        $timeout,
        _marcaService) {

    /**
     * Modelo de objecto Marca usado en la vista para agregar nuevas Marcas.
     */
    $scope._marcas = {
        "idMarca": null,
        "nombreMarca": "",
        "fechaCreacion": "",
        "fechaModificacion": null,
        "usuarioCreacion": null,
        "usuarioModificacion": null
    };

    /**
     * Funcion lista de Marcas, encargada de enlistar todas las Marcas disponibles
     * en la base de datos
     * @returns {undefined}
     */
    $scope.listaMarcas = function () {
        $scope.marcas = "";
        $promesa = _marcaService.getListaMarcas();
        $promesa.then(function (datos) {
            var data = datos.data;
            if (datos.status === 200) {
                $scope.marcas = datos.data;
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: "¡Op's algo paso!, comunicate con el administrador.",
                    showCloseButton: false
                });
            }
            $scope.tableMarcas = new NgTableParams({
                page: 1,
                count: 13
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.marcas;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    /**
     * Funcion agregar nueva Marca
     * @param {type} marca objeto Marca recibido desde la vista.
     * @returns {undefined}
     */
    $scope.agrearMarca = function (marca) {
        $promesa = _marcaService.addMarca(marca);
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Marca agregada con exito.',
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
     * Funcion eliminar Marca  
     * @param marca    
     * @returns {undefined}
     */
    $scope.eliminarMarca = function (marca) {
        ngDialog.open({
            template: 'views/marcas/modal-confirmar-eliminar-marca.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {marca: marca}
        });
    };

    /**
     * Funcion seleccionar Marca desde una tabla.
     * @param {type} marca objeto Marca seleccionado desde una fila 
     * @returns {undefined}
     */
    $scope.seleccionarMarca = function (marca) {
        $scope.__marca = marca;
    };

    $scope.panelMarcaEdit = true;
    $scope.hidePanelMarca = function (marca) {
        $scope.editMarca = marca;
        $scope.panelMarcaEdit = false;
    };

    /**
     * Funcion modificar Marca
     * @param {type} marca objeto Marca recibido desde la vista.
     * @returns {undefined}
     */
    $scope.modificarMarca = function (marca) {
        ngDialog.open({
            template: 'views/marcas/modal-confirmar-modificar-marca.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ModalController',
            closeByDocument: false,
            closeByEscape: false,
            data: {marca: marca}
        });
    };

    $scope.$on('reloadMarcas', function () {
        $scope.panelMarcaEdit = true;
        $reload = _marcaService.getListaMarcas();
        $reload.then(function (datos) {
            $scope.marcas = datos.data;
            $scope.tableMarcas.reload();
        });
    });

    /**
     * Configuraciones del objeto select en la vista, encargado de buscar 
     * Marcas por las letras ingresadas
     * @param {type} val string para la busqueda
     * @returns {unresolved}
     */
    $scope.getMarca = function (val) {
        var uri = BaseURL + 'marcas/searchText';
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
                    return item;
                });
            });
        });
    };

});


