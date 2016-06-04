/**
 * Controlador Categorias encargado de procesar datos referentes a las 
 * categorias registradas.
 * @param {type} param1
 * @param {type} param2
 */
miAppHome.controller('CategoriaController',
        function ($scope, $state, $timeout, toaster, NgTableParams, categoriaService) {

            /**
             * Modelo de objecto categoria usado en las vistas para Agregar.
             */
            $scope._categoria = {
                "idCategoria": null,
                "nombreCategoria": "",
                "usuarioCreacion": null,
                "usuarioModificacion": null,
                "fechaCreacion": "",
                "fechaModificacion": null,
                "estado": true,
                "tipoCategoria": {
                    "idTipo": null,
                    "nombreTipo": "",
                    "usuarioCreacion": null,
                    "usuarioModificacion": null,
                    "fechaCreacion": "",
                    "fechaModificacion": null,
                    "estado": true
                }
            };

            /**
             * Funcion lista de Categorias, encarga de enlistar todas las categorias 
             * disponibles en la base de datos.
             * @returns {undefined}
             */
            $scope.listaCategorias = function () {
                $scope.categorias = "";
                $promesa = categoriaService.getListaCategorias();
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        $scope.categorias = datos.data;
                    } else {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: "¡Op's algo paso!, comunicate con el administrador.",
                            showCloseButton: false
                        });
                    }
                    var data = datos.data;
                    $scope.tableCategorias = new NgTableParams({
                        page: 1,
                        count: 8
                    }, {
                        total: data.length,
                        getData: function (params) {
                            data = $scope.categorias;
                            params.total(data.length);
                            if (params.total() <= ((params.page() - 1) * params.count())) {
                                params.page(1);
                            }
                            return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        }});
                });
            };

            /**
             * Funcion agregar nueva Categoria.
             * @param {type} categoria objecto recibido desde la vista.
             * @returns {undefined}
             */
            $scope.agrearCategoria = function (categoria) {
                $promesa = categoriaService.addCategoria(categoria);
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        $timeout(function timer() {
                            $state.go($state.current, {}, {reload: true});
                        }, 2000);
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Categoria agregada con exito.',
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
             * Funcion eliminar Categoria
             * @returns {undefined}
             */
            $scope.eliminarCategoria = function () {
                $promesa = categoriaService.deleteCategoria($scope.__categoria);
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        toaster.pop('success', 'Exito', 'Categoria eliminada con exito.');
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Categoria eliminada con exito.',
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
             * Funcion seleccionar, encarga de seleccionar un objecto en particular en
             * una tabla
             * @param {type} categoria objecto recibido desde una tabla en la vista.
             * @returns {undefined}
             */
            $scope.seleccionarCategoria = function (categoria) {
                $scope.__categoria = categoria;
            };

            /**
             * Funcion modificar Categoria, encargada de modificar la Categoria 
             * seleccionada a travéz de un model en la vista.
             * @param {type} categoria objecto recibido desde un model en la vista.
             * @returns {undefined}
             */
            $scope._modificarCategoria = function (categoria) {
                $promesa = categoriaService.updateCategoria(categoria);
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Categoria modificada con exito.',
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

