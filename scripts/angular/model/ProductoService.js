/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.service('_productoService', function ($http, $q, $cookies, $rootScope) {

    this.getAll = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/list';
        $http({
            url: uri,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        });
        return deferred.promise;
    };

    this.add = function (producto) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/add';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(producto),
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        });
        return deferred.promise;
    };

    this.update = function (producto) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/update';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(producto),
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        });
        return deferred.promise;
    };

    this.delete = function (producto) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/delete';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(producto),
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        });
        return deferred.promise;
    };

    this.searchById = function (idProducto) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/search';
        $http({
            url: uri,
            method: 'post',
            params: {
                'id': idProducto
            },
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        });
        return deferred.promise;
    };
    
    this.searchByIdFactura = function (idFacturaProducto) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/list/factura';
        $http({
            url: uri,
            method: 'post',
            params: {
                'idFacturaProducto': idFacturaProducto
            },
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            datosRecu = response;
            deferred.resolve(datosRecu);
        });
        return deferred.promise;
    };

    this.searchByBarcode = function (barcode) {
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/stock';
        var list = $http({
            url: uri,
            method: 'post',
            params: {
                'barcode': barcode
            },
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        });
        return list;
    };

    this.advancedSearch = function (item) {
        var datosRecu = null;
        var deferred = $q.defer();
        var itemDescripcion = [];
        var itemMarca = [];
        var itemCategoria = [];
        var itemTemporada = [];
        var itemSexo = [];
        var itemTalla = [];
        var itemColor = [];
        var itemCodigoBarras = [];
        var itemFactura = [];
        var itemClase = [];
        var itemLista = [];
        var itemCompra = [];
        var itemVenta = [];
        var itemProveedor = [];
        var regDescripcion = new RegExp(item.descripcion, "i");
        var regMarca = new RegExp(item.marca, "i");
        var regCategoria = new RegExp(item.categoria, "i");
        var regTemporada = new RegExp(item.temporada, "i");
        var regSexo = new RegExp(item.sexo, "i");
        var regTalla = new RegExp(item.talla, "i");
        var regColor = new RegExp(item.color, "i");
        var regCodigo = new RegExp(item.codigo, "i");
        var regFactura = new RegExp(item.factura, "i");
        var regClase = new RegExp(item.claseProducto, "i");
        var regLista = new RegExp(item.lista, "i");
        var regCompra = new RegExp(item.compra, "i");
        var regVenta = new RegExp(item.venta, "i");
        var regProveedor = new RegExp(item.proveedor, "i");
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/producto/list';
        $http({
            url: uri,
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token.data.access_token,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            angular.forEach(response.data, function (value, key) {
                if (value.descripcion.search(regDescripcion) !== -1) {
                    itemDescripcion.push(value);
                }
            });
            angular.forEach(itemDescripcion, function (value, key) {
                if (value.marcas.nombreMarca.search(regMarca) !== -1) {
                    itemMarca.push(value);
                }
            });
            angular.forEach(itemMarca, function (value, key) {
                if (value.categoria.nombreCategoria.search(regCategoria) !== -1) {
                    itemCategoria.push(value);
                }
            });
            angular.forEach(itemCategoria, function (value, key) {
                if (value.temporada.nombreTemporada.search(regTemporada) !== -1) {
                    itemTemporada.push(value);
                }
            });
            angular.forEach(itemTemporada, function (value, key) {
                if (value.sexo.nombreSexo.search(regSexo) !== -1) {
                    itemSexo.push(value);
                }
            });
            angular.forEach(itemSexo, function (value, key) {
                if (value.talla.search(regTalla) !== -1) {
                    itemTalla.push(value);
                }
            });
            angular.forEach(itemTalla, function (value, key) {
                if (value.colorProducto.search(regColor) !== -1) {
                    itemColor.push(value);
                }
            });
            angular.forEach(itemColor, function (value, key) {
                if (value.codigoProducto.search(regCodigo) !== -1) {
                    itemCodigoBarras.push(value);
                }
            });
            angular.forEach(itemCodigoBarras, function (value, key) {
                if (value.facturaProducto.numeroFactura.search(regFactura) !== -1) {
                    itemFactura.push(value);
                }
            });
            angular.forEach(itemFactura, function (value, key) {
                if (value.claseProducto.search(regClase) !== -1) {
                    itemClase.push(value);
                }
            });
            angular.forEach(itemClase, function (value, key) {
                if (value.precioLista.toString().search(regLista) !== -1) {
                    itemLista.push(value);
                }
            });
            angular.forEach(itemLista, function (value, key) {
                if (value.precioCosto.toString().search(regCompra) !== -1) {
                    itemCompra.push(value);
                }
            });
            angular.forEach(itemCompra, function (value, key) {
                if (value.precioVenta.toString().search(regVenta) !== -1) {
                    itemVenta.push(value);
                }
            });
            angular.forEach(itemVenta, function (value, key) {
                if (value.facturaProducto.proveedor.nombreProveedor.search(regProveedor) !== -1) {
                    itemProveedor.push(value);
                }
            });
            datosRecu = itemProveedor;
            deferred.resolve(datosRecu);
        }, function errorCallback(response) {
            console.log(response);
        });
        return deferred.promise;
    };

});

