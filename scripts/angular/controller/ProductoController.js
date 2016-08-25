/**
 * Controlador Producto, encargado de procesar datos para el objeto Producto
 * @param {type} param1
 * @param {type} param2
 */
miAppHome.controller('ProductoController', function ($scope,
        ngDialog,
        BaseURL,
        cookieService,
        $state,
        facturaProductoService,
        $stateParams,
        toaster,
        NgTableParams,
        $rootScope,
        $http,
        $timeout,
        $cookies,
        _productoService) {
    /*
     * objeto type encargado de dar formato a los codigos de barra.
     */
    $scope.listaBusqueda = [];
    $scope.hide = false;
    $scope.type = 'CODE128C';

    $scope.prod = {
        descripcion: "",
        marca: "",
        talla: "",
        codigo: "",
        categoria: ""
    };

    $scope.find = {
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

    $scope.search = {
        'categoria': "",
        'claseProducto': "",
        'codigo': "",
        'color': "",
        'compra': "",
        'descripcion': "",
        'factura': "",
        'lista': "",
        'marca': "",
        'proveedor': "",
        'sexo': "",
        'talla': "",
        'temporada': "",
        'venta': ""
    };

    $scope.classes = [
        {value: 'A', name: 'Clase A'},
        {value: 'B', name: 'Clase B'}
    ];

    /**
     * objeto Producto encargado de dar formato al objeto Producto para agregar
     * nuevos Productos
     */
    $scope._producto = {
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
    /**
     * Funciones encargadas de manejar el datepicker en productos
     */
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: null,
        startingDay: 1
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };

    /**
     * Funcion para controlar el stock minimo en el listado
     * @param {type} producto
     * @returns {Boolean}
     */
    $scope.stockMinimo = function (producto) {
        if (producto.cantidadTotal <= producto.cantidadMinima) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Funcion encargada de enlistar los Productos disponibles en la base de
     * datos
     * @returns {undefined}
     */
    $scope.listaProductos = function () {
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
                        console.log(response);
                        params.total(response.data.totalElements);
                        return response.data.content;
                    }, function errorCallback(response) {
                    });
                }
            });
        });
    };

    /**
     * Funcion encargada de agregar un Producto nuevo a la base de datos.
     * @param {type} producto objeto Producto recibido desde la vista
     * @returns {undefined}
     */
    $scope.agregarProducto = function (producto) {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $detail = facturaProductoService.detail(idFacturaProducto);
        $detail.then(function (datos) {
            if (datos.status === 200) {
                producto.facturaProducto = datos.data;
            }
            $promesa = _productoService.add(producto);
            $promesa.then(function (datos) {
                if (datos.status === 200) {
                    ngDialog.closeAll();
                    /* directiva encargada de retrasar 1 segundo la redireccion a 
                     * la correspondiente location. */
                    $timeout(function timer() {
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Producto agregado correctamente.',
                            showCloseButton: false
                        });
                        $state.go('panel_factura_producto', {"idFactura": idFacturaProducto});
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
    };

    /**
     *
     * @param {type} idCategoria
     * @param {type} idMarca
     * @returns {undefined}
     */
    $scope.randomCode = function (idCategoria, idMarca) {
        var codigo = Math.floor((Math.random() * 9999) + 1000);
        var barcode = "";
        if (idMarca === null || typeof idMarca === 'undefined' || idCategoria === null || typeof idCategoria === 'undefined') {
            toaster.pop({
                type: 'error',
                title: 'Error',
                body: 'Revisa los campos anteriores.',
                showCloseButton: false
            });
        } else {
            barcode = "" + idCategoria + idMarca + codigo;
        }
        return barcode;
    };

    /**
     * Funcion eliminar Producto
     * @param {object} producto objeto producto a modificar
     * @returns {undefined}
     */
    $scope.eliminarProductoDetalle = function (producto) {
        ngDialog.open({
            template: 'views/producto/modal-confirmar-eliminar-producto-detalle.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ProductoController',
            closeByDocument: false,
            closeByEscape: false,
            data: {producto: producto}
        });
    };

    $scope.confirmarEliminarProductoDetalle = function (producto) {
        $promesa = _productoService.delete(producto);
        $promesa.then(function (datos) {
            console.log(datos);
            ngDialog.closeAll();
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Producto eliminado correctamente.',
                    showCloseButton: false
                });
                $state.go('productos');
            } else {
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: "Este producto ya ha sido usado y/o distribuido.",
                    showCloseButton: false
                });
            }
        });
    };

    /**
     * Funcion encargada de seleccionar un objeto tipo Producto de una tabla
     * @param {type} producto objeto seleccionado de una fila.
     * @returns {undefined}
     */
    $scope.seleccionarProducto = function (producto) {
        $scope.__producto = producto;
        $scope.__producto.fechaProducto = new Date(producto.fechaProducto);
    };

    $scope.editarProducto = true;
    $scope.hidePanelProducto = function (producto) {
        $scope.productoEdit = producto;
        $scope.editarProducto = false;
    };

    /**
     * Funcion modificar Producto existente en la base de datos.
     * @param {type} producto objeto producto recibido desde la vista
     * @returns {undefined}
     */
    $scope.modificarProducto = function (producto) {
        ngDialog.open({
            template: 'views/producto/modal-modificar-producto.html',
            className: 'ngdialog-theme-sm',
            showClose: false,
            controller: 'ProductoController',
            closeByDocument: false,
            closeByEscape: false,
            data: {producto: producto}
        });
    };

    $scope.confirmarModificarProducto = function (producto) {
        $promesa = _productoService.update(producto);
        $promesa.then(function (datos) {
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
    };

    /**
     * Funcio para la busqueda dinamica de productos y su posterior redireccion
     * a sus respectivos detalles.
     * @returns {undefined}
     */
    $scope.buscarProducto = function () {
        $scope.options = {
            width: 1,
            height: 30,
            displayValue: true,
            font: 'monospace',
            textAlign: 'center',
            fontSize: 15,
            backgroundColor: '#FFFFFF',
            lineColor: '#000000'
        };
        var idProducto = $stateParams.idProducto;
        $promesa = _productoService.searchById(idProducto);
        $promesa.then(function (datos) {
            console.log(datos);
            if (datos.status !== 200) {
                $state.go('productos');
            } else {
                $scope.foundProducto = datos.data;
            }
        });
    };

    /**
     * Funcion encargada de mandar a imprimir un div que contiene el codigo de
     * barra de un Producto.
     * @param {type} divName id del div a imprimir
     * @returns {undefined}
     */
    $scope.printDiv = function (divName) {
        var printContents = document.getElementById(divName).innerHTML;
        sendCommandToWorker(printContents);
        var electron = require('electron');
        var window = electron.remote.getCurrentWindow();
//        window.webContents.print();
    };
    /**
     * configuracion para la busqueda dinamica de Productos para la directiva
     * select
     */
    $scope.select2Config = {
        mode: 'object',
        id: 'idProducto',
        text: 'descripcion',
        options: function (searchText) {
            var token = $cookies.getObject('token');
            var uri = BaseURL + 'producto/searchText';
            return $http({
                url: uri,
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token.data.access_token
                },
                params: {
                    'text': searchText
                }
            });
        },
        select2: {
            minimumInputLength: 2
        }
    };

    /**
     * Funcion remover producto, cambia estado false.
     */
    $scope.removerProducto = function () {
        $scope.__producto.estadoProducto = false;
        $remover = _productoService.update($scope.__producto);
        $remover.then(function (datos) {
            if (datos.status === 200) {
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'El producto ha sido removido.',
                    showCloseButton: false
                });
                $recargar = _productoService.getAll();
                $recargar.then(function (datos) {
                    $scope.listaBusqueda = datos.data;
                    $scope.productos = datos.data;
                    $scope.tableProductos.reload();
                    $scope.tableBusqueda.reload();
                });

            }
        });
    };


    $scope.confirmarEliminarProducto = function (producto) {
        ngDialog.open({
            template: 'views/producto/modal-confirmar-eliminar-producto.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'ProductoController',
            closeByDocument: false,
            closeByEscape: false,
            data: {producto: producto}
        });
    };

    $scope.eliminarProductoFactura = function (producto) {
        var idFacturaProducto = $stateParams.idFactura;
        $eliminar = _productoService.delete(producto);
        $eliminar.then(function (datos) {
            if (datos.status === 200) {
                ngDialog.closeAll();
                $rootScope.$broadcast('updateTableProducto', {'idFactura': idFacturaProducto});
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'El producto ha sido eliminado.',
                    showCloseButton: false
                });
            }
        });
    };

    $scope.initBusqueda = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableBusqueda = new NgTableParams({
                page: 1,
                count: 11
            }, {
                total: $scope.listaBusqueda.length,
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
    };

    $scope.byAllParams = function () {
        var token = cookieService.get('token');
        token.then(function (data) {
            $scope.tableByAllParams = new NgTableParams({
                page: 1,
                count: 13
            }, {
                total: $scope.listaBusqueda.length,
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
    };

    $scope.searchByAllParams = function (producto) {
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
        $scope.byAllParams();
    };
    
    $scope.busquedaProducto = function (producto) {
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
            $scope.initBusqueda();
        }
    };

    $scope.limpiarBusqueda = function () {
        $scope.search = {
            'categoria': "",
            'claseProducto': "",
            'codigo': "",
            'color': "",
            'compra': "",
            'descripcion': "",
            'factura': "",
            'lista': "",
            'marca': "",
            'proveedor': "",
            'sexo': "",
            'talla': "",
            'temporada': "",
            'venta': ""
        };
        $scope.hide = false;
        $scope.listaBusqueda = "";
        $scope.tableBusqueda.reload();
    };

    $scope.agregarRepetirClase = function (producto) {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $detail = facturaProductoService.detail(idFacturaProducto);
        $detail.then(function (datos) {
            if (datos.status === 200) {
                producto.facturaProducto = datos.data;
            }
            $add = _productoService.add(producto);
            $add.then(function (datos) {
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
    };

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
        $scope._producto.claseProducto = "";
        $scope._producto.precioCosto = "";
        $scope._producto.precioLista = "";
        $scope._producto.precioVenta = "";
        $scope._producto.cantidadMinima = "";
        $scope._producto.cantidadTotal = "";
    });

    $scope.agregarCambiarTalla = function (producto) {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $detail = facturaProductoService.detail(idFacturaProducto);
        $detail.then(function (datos) {
            if (datos.status === 200) {
                producto.facturaProducto = datos.data;
            }
            $add = _productoService.add(producto);
            $add.then(function (datos) {
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
    };

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
        $scope._producto.codigoProducto = "";
        $scope._producto.claseProducto = "";
        $scope._producto.precioCosto = "";
        $scope._producto.precioLista = "";
        $scope._producto.precioVenta = "";
        $scope._producto.cantidadMinima = "";
        $scope._producto.cantidadTotal = "";
        $scope._producto.talla = "";
    });

    $scope.listaProductosFacturaDeprecated = function () {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $list = _productoService.searchByIdFactura(idFacturaProducto);
        $list.then(function (datos) {
            $scope.productosFactura = datos.data;
            var data = datos;
            $scope.tableProductosFactura = new NgTableParams({
                page: 1,
                count: 12
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.productosFactura;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }
            });
        });
    };
    $scope.listaProductosFactura = function () {
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
    };

    $rootScope.$on('updateTableProducto', function (event, object) {
        $scope.tableProductosFactura.reload();
        $rootScope.$broadcast('updateStock', {});
    });

    $scope.elegirCarga = function (producto) {
        ngDialog.open({
            template: 'views/producto/modal-elegir-carga.html',
            className: 'ngdialog-theme-advertencia',
            showClose: false,
            controller: 'ProductoController',
            closeByDocument: false,
            closeByEscape: false,
            data: {producto: producto}
        });
    };

    $scope.windowBusqueda = function () {
        var electron = require('electron');
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

            };
        });

