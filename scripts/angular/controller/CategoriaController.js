(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .controller('CategoriaController', CategoriaController);

    CategoriaController.$inject = ['$scope', '$rootScope', '$timeout', 'toaster', 'NgTableParams', 'categoriaService', 'ngDialog'];

    function CategoriaController($scope, $rootScope, $timeout, toaster, NgTableParams, categoriaService, ngDialog) {
        var vm = this;
        /*VARIABLES*/
        vm._categoria = {
            "idCategoria": null,
            "nombreCategoria": "",
            "usuarioCreacion": null,
            "usuarioModificacion": null,
            "fechaCreacion": "",
            "fechaModificacion": null,
            "estado": true,
            "tipoCategoria": null
        };
        vm.panelCategoriaEdit = true;
        vm.editCategoria = null;
        /*METODOS*/
        vm.agregarCategoria = agregarCategoria;
        vm.eliminarCategoria = eliminarCategoria;
        vm.hidePanelCategoria = hidePanelCategoria;
        vm.listaCategorias = listaCategorias;
        vm.modificarCategoria = modificarCategoria;

        function agregarCategoria(categoria) {
            categoriaService
                    .addCategoria(categoria)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $timeout(function timer() {
                                $rootScope.tabs = 0;
                                $scope.$emit('reloadCategorias', {});
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
        }

        function eliminarCategoria(categoria) {
            ngDialog.open({
                template: 'views/categoria/modal-confirmar-eliminar-categoria.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {categoria: categoria}
            });
        }

        function hidePanelCategoria(categoria) {
            vm.editCategoria = categoria;
            vm.panelCategoriaEdit = false;
        }

        function listaCategorias() {
            $scope.categorias = "";
            categoriaService.getListaCategorias()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.categorias = datos.data;
                        }
                        var data = datos.data;
                        $scope.tableCategorias = new NgTableParams({
                            page: 1,
                            count: 13
                        }, {
                            total: data.length,
                            getData: function (params) {
                                data = $scope.categorias;
                                params.total(data.length);
                                if (params.total() <= ((params.page() - 1) * params.count())) {
                                    params.page(1);
                                }
                                return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            }
                        });
                    });
        }

        function modificarCategoria(categoria) {
            ngDialog.open({
                template: 'views/categoria/modal-confirmar-modificar-categoria.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ModalController',
                closeByDocument: false,
                closeByEscape: true,
                data: {categoria: categoria}
            });
        }

        $scope.$on('reloadCategorias', function () {
            vm.panelCategoriaEdit = true;
            categoriaService.getListaCategorias()
                    .then(function (datos) {
                        $scope.categorias = datos.data;
                        $scope.tableCategorias.reload();
                    });
        });

    }

})();