(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .controller('ProductoController', ProductoController);

    ProductoController.$inject = ['$scope', 'ngDialog', 'BaseURL', 'cookieService', '$state', 'facturaProductoService', '$stateParams', 'toaster', 'NgTableParams', '$rootScope', '$http', '$timeout', '_productoService'];

    function ProductoController($scope, ngDialog, BaseURL, cookieService, $state, facturaProductoService, $stateParams, toaster, NgTableParams, $rootScope, $http, $timeout, _productoService) {
        var electron = require('electron');
        var vm = this;
        var window = electron.remote.getCurrentWindow();
        /*VARIABLES*/
        vm._producto = {
            "idProducto": null,
            "codigoProducto": null,
            "claseProducto": null,
            "categoria": null,
            "marcas": null,
            "facturaProducto": null,
            "sexo": null,
            "temporada": null,
            "descripcion": null,
            "colorProducto": null,
            "precioCosto": null,
            "precioVenta": null,
            "precioLista": null,
            "cantidadTotal": null,
            "cantidadMinima": null,
            "talla": null,
            "estadoProducto": true,
            "fechaCreacion": null,
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        };
        vm.classes = [
            {value: 'A', name: 'Clase A'},
            {value: 'B', name: 'Clase B'}
        ];
        vm.foundProducto = null;
        vm.editarProducto = true;
        vm.find = {
            descripcion: "",
            marca: {
                nombreMarca: ""
            },
            talla: "",
            codigo: "",
            categoria: {
                nombreCategoria: ""
            },
            temporada: {
                nombreTemporada: ""
            },
            sexo: {
                nombreSexo: ""
            },
            clase: "",
            color: "",
            proveedor: "",
            factura: ""
        };
        vm.prod = {
            descripcion: "",
            marca: "",
            talla: "",
            codigo: "",
            categoria: ""
        };
        vm.productoEdit = null;
        /*METODOS*/
        vm.agregarCambiarTalla = agregarCambiarTalla;
        vm.agregarProducto = agregarProducto;
        vm.agregarRepetirClase = agregarRepetirClase;
        vm.buscarProducto = buscarProducto;
        vm.busquedaProducto = busquedaProducto;
        vm.byAllParams = byAllParams;
        vm.confirmarEliminarProducto = confirmarEliminarProducto;
        vm.confirmarEliminarProductoDetalle = confirmarEliminarProductoDetalle;
        vm.confirmarModificarProducto = confirmarModificarProducto;
        vm.elegirCarga = elegirCarga;
        vm.eliminarProductoDetalle = eliminarProductoDetalle;
        vm.eliminarProductoFactura = eliminarProductoFactura;
        vm.hidePanelProducto = hidePanelProducto;
        vm.initBusqueda = initBusqueda;
        vm.listaProductos = listaProductos;
        vm.listaProductosFactura = listaProductosFactura;
        vm.modificarProducto = modificarProducto;
        vm.printDiv = printDiv;
        vm.randomCode = randomCode;
        vm.removerProducto = removerProducto;
        vm.searchByAllParams = searchByAllParams;
        vm.stockMinimo = stockMinimo;
        vm.windowBusqueda = windowBusqueda;

        function agregarCambiarTalla(producto) {
            facturaProductoService
                    .detail($stateParams.idFactura)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            producto.facturaProducto = datos.data;
                        }
                        _productoService
                                .add(producto)
                                .then(function (datos) {
                                    if (datos.status === 200) {
                                        ngDialog.closeAll();
                                        $rootScope.$broadcast('recargarTalla');
                                        toaster.pop({
                                            type: 'success',
                                            title: 'Exito.',
                                            body: 'Producto añadido, puedes recargar otro.',
                                            showCloseButton: false
                                        });
                                    } else {
                                        toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: 'No se ha podido agregar Producto.',
                                            showCloseButton: false
                                        });
                                    }
                                }).catch(function (fallback) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: 'No se ha podido agregar Producto.',
                                showCloseButton: false
                            });
                        });
                    });
        }

        function agregarProducto(producto) {
            facturaProductoService
                    .detail($stateParams.idFactura)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            producto.facturaProducto = datos.data;
                        }
                        _productoService
                                .add(producto)
                                .then(function (datos) {
                                    if (datos.status === 200) {
                                        ngDialog.closeAll();
                                        $timeout(function timer() {
                                            toaster.pop({
                                                type: 'success',
                                                title: 'Exito',
                                                body: 'Producto agregado correctamente.',
                                                showCloseButton: false
                                            });
                                            $state.go('panel_factura_producto', {"idFactura": $stateParams.idFactura});
                                        }, 1000);
                                    } else {
                                        ngDialog.closeAll();
                                        toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: "¡Op's algo paso!, revisa los campos por favor.",
                                            showCloseButton: false
                                        });
                                    }
                                });
                    });
        }

        function agregarRepetirClase(producto) {
            facturaProductoService
                    .detail($stateParams.idFactura)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            producto.facturaProducto = datos.data;
                        }
                        _productoService
                                .add(producto)
                                .then(function (datos) {
                                    if (datos.status === 200) {
                                        ngDialog.closeAll();
                                        $rootScope.$broadcast('recargarClase');
                                        toaster.pop({
                                            type: 'success',
                                            title: 'Exito.',
                                            body: 'Producto añadido, puedes recargar otro.',
                                            showCloseButton: false
                                        });
                                    } else {
                                        toaster.pop({
                                            type: 'error',
                                            title: 'Error',
                                            body: 'No se ha podido agregar Producto.',
                                            showCloseButton: false
                                        });
                                    }
                                }).catch(function (fallback) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: 'No se ha podido agregar Producto.',
                                showCloseButton: false
                            });
                        });
                    });
        }

        function buscarProducto() {
            _productoService
                    .searchById($stateParams.idProducto)
                    .then(function (datos) {
                        if (datos.status !== 200) {
                            $state.go('productos');
                        } else {
                            vm.foundProducto = datos.data;
                        }
                    });
        }

        function busquedaProducto(producto) {
            if (producto.descripcion === ""
                    && producto.marca === ""
                    && producto.talla === ""
                    && producto.codigo === ""
                    && producto.categoria === "") {
                toaster.pop({
                    type: 'error',
                    title: "Error",
                    body: 'Los campos de busqueda no deben estar vacios.',
                    showCloseButton: false
                });
            } else {
                $state.go('helper',
                        {
                            descripcion: producto.descripcion.toUpperCase(),
                            marca: producto.marca.toUpperCase(),
                            talla: producto.talla.toUpperCase(),
                            codigo: producto.codigo.toUpperCase(),
                            categoria: producto.categoria.toUpperCase()
                        }, {notify: false});
                initBusqueda();
            }
        }

        function byAllParams() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableByAllParams = new NgTableParams({
                    page: 1,
                    count: 13
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "producto/full",
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                page: params.page() - 1,
                                size: params.count(),
                                descripcion: $state.params.descripcion,
                                marca: $state.params.marca,
                                talla: $state.params.talla,
                                codigo: $state.params.codigo,
                                categoria: $state.params.categoria,
                                temporada: $state.params.temporada,
                                sexo: $state.params.sexo,
                                clase: $state.params.clase,
                                color: $state.params.color,
                                proveedor: $state.params.proveedor,
                                factura: $state.params.factura
                            }
                        }).then(function successCallback(response) {
                            params.total(response.data.totalElements);
                            return response.data.content;
                        }, function errorCallback(response) {
                        });
                    }});
            });
        }

        function confirmarEliminarProducto(producto) {
            ngDialog.open({
                template: 'views/producto/modal-confirmar-eliminar-producto.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'ProductoController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {producto: producto}
            });
        }

        function confirmarEliminarProductoDetalle(producto) {
            _productoService
                    .delete(producto)
                    .then(function (datos) {
                        ngDialog.closeAll();
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Producto eliminado correctamente.',
                                showCloseButton: false
                            });
                            $timeout(function timer() {
                                window.webContents.goBack();
                            }, 2000);
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: "Este producto ya ha sido usado y/o distribuido.",
                                showCloseButton: false
                            });
                        }
                    });
        }

        function confirmarModificarProducto(producto) {
            _productoService
                    .update(producto)
                    .then(function (datos) {
                        ngDialog.closeAll();
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Producto modificado correctamente.',
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

        function elegirCarga(producto) {
            ngDialog.open({
                template: 'views/producto/modal-elegir-carga.html',
                className: 'ngdialog-theme-advertencia',
                showClose: false,
                controller: 'ProductoController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {producto: producto}
            });
        }

        function eliminarProductoDetalle(producto) {
            ngDialog.open({
                template: 'views/producto/modal-confirmar-eliminar-producto-detalle.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ProductoController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {producto: producto}
            });
        }

        function eliminarProductoFactura(producto) {
            _productoService
                    .delete(producto)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            ngDialog.closeAll();
                            $rootScope.$broadcast('updateTableProducto', {'idFactura': $stateParams.idFactura});
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'El producto ha sido eliminado.',
                                showCloseButton: false
                            });
                        }
                    });
        }

        function hidePanelProducto(producto) {
            vm.productoEdit = producto;
            vm.editarProducto = false;
        }

        function initBusqueda() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableBusqueda = new NgTableParams({
                    page: 1,
                    count: 11
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "producto/advanced",
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                page: params.page() - 1,
                                size: params.count(),
                                descripcion: $state.params.descripcion,
                                marca: $state.params.marca,
                                talla: $state.params.talla,
                                codigo: $state.params.codigo,
                                categoria: $state.params.categoria
                            }
                        }).then(function successCallback(response) {
                            params.total(response.data.totalElements);
                            return response.data.content;
                        }, function errorCallback(response) {
                        });
                    }});
            });
        }

        function listaProductos() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableProductos = new NgTableParams({
                    page: 1,
                    count: 13
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + "producto/paged",
                            method: 'get',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                page: params.page() - 1,
                                size: params.count()
                            }
                        }).then(function successCallback(response) {
                            params.total(response.data.totalElements);
                            return response.data.content;
                        }, function errorCallback(response) {
                        });
                    }
                });
            });
        }

        function listaProductosFactura() {
            var token = cookieService.get('token');
            token.then(function (data) {
                $scope.tableProductosFactura = new NgTableParams({
                    page: 1,
                    count: 12
                }, {
                    getData: function (params) {
                        return $http({
                            url: BaseURL + 'producto/list/factura/paged',
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + data,
                                'Content-type': 'application/json'
                            },
                            params: {
                                idFacturaProducto: $stateParams.idFactura,
                                page: params.page() - 1,
                                size: params.count()
                            }
                        }).then(function successCallback(response) {
                            params.total(response.data.totalElements);
                            return response.data.content;
                        }, function errorCallback(response) {
                        });
                    }
                });
            });
        }

        function modificarProducto(producto) {
            ngDialog.open({
                template: 'views/producto/modal-modificar-producto.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'ProductoController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {producto: producto}
            });
        }

        $scope.$on('recargarClase', function (event) {
            /*deshabilitamos campos que no deben cambiar*/
            $scope.descripcionProducto = true;
            $scope.marcaProducto = true;
            $scope.categoriaProducto = true;
            $scope.temporadaProducto = true;
            $scope.sexoProducto = true;
            $scope.tallaProducto = true;
            $scope.colorProducto = true;
            $scope.codigoProducto = true;
            $scope.facturaProducto = true;
            /*nos aseguramos que los campos posibles a cambiar esten habilitados*/
            $scope.claseProducto = false;
            $scope.stockProducto = false;
            $scope.minimoProducto = false;
            /*limpiamos campos*/
            vm._producto.claseProducto = "";
            vm._producto.precioCosto = "";
            vm._producto.precioLista = "";
            vm._producto.precioVenta = "";
            vm._producto.cantidadMinima = "";
            vm._producto.cantidadTotal = "";
        });

        $scope.$on('recargarTalla', function (event) {
            /*deshabilitamos campos que no deben cambiar*/
            $scope.marcaProducto = true;
            $scope.categoriaProducto = true;
            $scope.temporadaProducto = true;
            $scope.sexoProducto = false;
            $scope.fechaProducto = true;
            /*nos aseguramos que los campos posibles a cambiar esten habilitados*/
            $scope.descripcionProducto = false;
            $scope.codigoProducto = false;
            $scope.colorProducto = false;
            $scope.stockProducto = false;
            $scope.minimoProducto = false;
            $scope.tallaProducto = false;
            $scope.claseProducto = false;
            /*limpiamos codigo para evitar repetir*/
            vm._producto.codigoProducto = "";
            vm._producto.claseProducto = "";
            vm._producto.precioCosto = "";
            vm._producto.precioLista = "";
            vm._producto.precioVenta = "";
            vm._producto.cantidadMinima = "";
            vm._producto.cantidadTotal = "";
            vm._producto.talla = "";
        });

        $rootScope.$on('updateTableProducto', function (event, object) {
            $scope.tableProductosFactura.reload();
            $rootScope.$broadcast('updateStock', {});
        });

        function printDiv(divName, producto, path, type) {
            var native = false;
            if (!native) {
                var spaceless = producto.descripcion.split(' ').join('%20');
                var descripcion = spaceless.split('Ñ').join('%C3%91');
                var talla = producto.talla.split(' ').join('%20');
                var codigo = producto.codigoProducto.split(' ').join('%20');
                var url = "";
                if (type) {
                    url = "http://localhost:3000/printer.html#/" + path + "/" +
                            talla + "/" +
                            codigo;
                } else {
                    url = "http://localhost:3000/printer.html#/" + path + "/" +
                            descripcion + "/" +
                            talla + "/" +
                            codigo;
                }
                var exec = require('child_process').exec;
                exec('start /max chrome.exe --incognito --app=' + url, function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
            } else {
                var printContents = document.getElementById(divName).innerHTML;
                sendCommandToWorker(printContents);
            }
        }

        function randomCode(idCategoria, idMarca) {
            var codigo = Math.floor((Math.random() * 9999) + 1000);
            var barcode = "";
            if (idMarca === null || typeof idMarca === 'undefined' || idCategoria === null || typeof idCategoria === 'undefined') {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: 'Faltan categoria y/o marca.',
                    showCloseButton: false
                });
            } else {
                barcode = "" + idCategoria + idMarca + codigo;
            }
            return barcode;
        }

        function removerProducto(producto) {
            producto.estadoProducto = false;
            _productoService
                    .update(producto)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'El producto ha sido removido.',
                                showCloseButton: false
                            });
                            _productoService
                                    .getAll()
                                    .then(function (datos) {
                                        $scope.listaBusqueda = datos.data;
                                        $scope.productos = datos.data;
                                        $scope.tableProductos.reload();
                                        $scope.tableBusqueda.reload();
                                    });

                        }
                    });
        }

        function searchByAllParams(producto) {
            console.log(producto);
            $state.go('busqueda_producto', {
                descripcion: producto.descripcion,
                marca: producto.marca.nombreMarca,
                talla: producto.talla,
                codigo: producto.codigo,
                categoria: producto.categoria.nombreCategoria,
                temporada: producto.temporada.nombreTemporada,
                sexo: producto.sexo.nombreSexo,
                clase: producto.clase,
                color: producto.color,
                proveedor: producto.proveedor,
                factura: producto.factura
            }, {notify: false});
            byAllParams();
        }

        function stockMinimo(producto) {
            if (producto.cantidadTotal <= producto.cantidadMinima) {
                return true;
            } else {
                return false;
            }
        }

        function windowBusqueda() {
            var busq = new electron.remote.BrowserWindow({
                transparent: false,
                frame: false,
                fullscreen: false,
                width: 1100,
                height: 550,
                show: false,
                modal: true,
                resizable: false,
                icon: __dirname + '/styles/images/app.png'
            });
            busq.loadURL(`file://${__dirname}/index.html#/helper`);
            busq.once('ready-to-show', function () {
                busq.show();
            });
        }

    }

})();
