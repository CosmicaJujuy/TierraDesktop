/**
 * Controlador Producto, encargado de procesar datos para el objeto Producto
 * @param {type} param1
 * @param {type} param2
 */
miAppHome.controller('ProductoController', function ($scope, localStorageService, $state, facturaProductoService, $stateParams, toaster, NgTableParams, $rootScope, $http, $routeParams, $route, $timeout, $cookies, $location, _productoService) {
    /*
     * objeto type encargado de dar formato a los codigos de barra.
     */
    $scope.listaBusqueda = "";
    $scope.hide = false;
    $scope.type = 'CODE128C';

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

    /**
     * objeto Producto encargado de dar formato al objeto Producto para agregar
     * nuevos Productos
     */
    $scope._producto = {
        "idProducto": null,
        "codigoProducto": null,
        "claseProducto": null,
        "categoria": {
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
        },
        "marcas": {
            "idMarca": null,
            "nombreMarca": "",
            "fechaCreacion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null,
            "estado": true
        },
        "facturaProducto": null,
        "sexo": {
            "idSexo": null,
            "nombreSexo": "",
            "fechaCreacion": "",
            "fechaModificacion": null,
            "usuarioCreacion": null,
            "usuarioModificacion": null
        },
        "temporada": {
            "idTemporada": null,
            "nombreTemporada": "",
            "usuarioCreacion": null,
            "usuarioModificacion": null,
            "fechaCreacion": "",
            "fechaModificacion": null
        },
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
    $scope.productos = localStorageService.get('localStorageProductos');
    $scope.listaProductos = function () {
        var length = 0;
        if ($scope.productos !== null) {
            length = $scope.productos.length;
            $scope.tableProductos = new NgTableParams({
                page: 1,
                count: 10
            }, {
                total: length,
                getData: function (params) {
                    var data = $scope.productos;
                    params.total(length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        }
        $promesa = _productoService.getAll();
        $promesa.then(function (datos) {
            if (datos.status === 200) {
                localStorageService.set('localStorageProductos', datos.data);
                if ($scope.productos === null) {
                    $scope.productos = datos.data;
                    $scope.tableProductos = new NgTableParams({
                        page: 1,
                        count: 10
                    }, {
                        total: $scope.productos.length,
                        getData: function (params) {
                            var data = $scope.productos;
                            params.total(data.length);
                            if (params.total() <= ((params.page() - 1) * params.count())) {
                                params.page(1);
                            }
                            return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        }});
                } else {
                    $scope.productos = datos.data;
                    $scope.tableProductos.reload();
                }
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
//            if(producto.){
//                
//            }
            $promesa = _productoService.add(producto);
            $promesa.then(function (datos) {
                if (datos.status === 200) {
                    /* directiva encargada de retrasar 1 segundo la redireccion a 
                     * la correspondiente location. */
                    $timeout(function timer() {
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Producto agregado correctamente.',
                            showCloseButton: false
                        });
                        $state.go('^.agregar-producto-factura', {"idFactura": idFacturaProducto});
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
        if (idMarca === null || idCategoria === null) {
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
     * @returns {undefined}
     */
    $scope.eliminarProducto = function () {
        var idProducto = $routeParams.idProducto;
        $producto = _productoService.searchById(idProducto);
        $producto.then(function (datos) {
            if (datos.status === 200) {
                $promesa = _productoService.delete(datos.data);
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        toaster.pop({
                            type: 'success',
                            title: 'Exito',
                            body: 'Producto eliminado correctamente.',
                            showCloseButton: false
                        });
                        $state.go('^.producto-lista');
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

    /**
     * Funcion modificar Producto existente en la base de datos.
     * @param {type} producto objeto producto recibido desde la vista 
     * @returns {undefined}
     */
    $scope._modificarProducto = function (producto) {
        $promesa = _productoService.update(producto);
        $promesa.then(function (datos) {
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
            if (datos.status !== 200) {
                $state.go('^.producto-lista');
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
        var popupWin = window.open('', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css"  type=\"text/css\" media=\"print\" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
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
            var uri = 'https://tierradecoloresapi.herokuapp.com/producto/searchText';
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

    $scope.busquedaProducto = function (producto) {
        $busqueda = _productoService.advancedSearch(producto);
        $busqueda.then(function (datos) {
            $scope.listaBusqueda = datos;
            var data = datos;
            $scope.tableBusqueda = new NgTableParams({
                page: 1,
                count: 10
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.listaBusqueda;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
            if ($scope.listaBusqueda.length === 0) {
                $scope.hide = false;
                toaster.pop({
                    type: 'info',
                    title: "¡Op's!",
                    body: 'Sin resultados.',
                    showCloseButton: false
                });
            } else {
                $scope.hide = true;
                toaster.pop({
                    type: 'success',
                    title: 'Exito',
                    body: 'Productos encontrados.',
                    showCloseButton: false
                });
            }
        });
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

    $scope.listaProductosFactura = function () {
        var idFacturaProducto = parseInt($stateParams.idFactura);
        $list = _productoService.searchByIdFactura(idFacturaProducto);
        $list.then(function (datos) {
            $scope.productosFactura = datos.data;
            var data = datos;
            $scope.tableProductosFactura = new NgTableParams({
                page: 1,
                count: 8
            }, {
                total: data.length,
                getData: function (params) {
                    data = $scope.productosFactura;
                    params.total(data.length);
                    if (params.total() <= ((params.page() - 1) * params.count())) {
                        params.page(1);
                    }
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }});
        });
    };

    $rootScope.$on('updateTableProducto', function (event, object) {
        $list = _productoService.searchByIdFactura(object.idFactura);
        $list.then(function (datos) {
            $scope.productosFactura = datos.data;
            $rootScope.$broadcast('updateStock', {});
            $scope.tableProductosFactura.reload();
        });
    });
});

