/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.service('facturaService', function ($q, $http, $cookies, $rootScope) {

    this.getAll = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/factura/list';
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

    this.getVendedores = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/vendedores';
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

    this.getDay = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/factura/day';
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

    this.add = function (factura) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/factura/add';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(factura),
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

    this.update = function (factura) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/factura/update';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(factura),
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

    this.searchById = function (idFactura) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/factura/search';
        $http({
            url: uri,
            method: 'post',
            params: {
                'idFactura': idFactura
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

    this.getDetalleFacturaList = function (idFacturaDetalle) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/detalle/factura';
        $http({
            url: uri,
            method: 'get',
            params: {
                'idFactura': idFacturaDetalle
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

    this.addDetalleFactura = function (idFactura, idProducto, idItem, cantidadItem) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/detalle/add';
        $http({
            url: uri,
            method: 'post',
            params: {
                'idFactura': idFactura,
                'idProducto': idProducto,
                'idItem': idItem,
                'cantidadItem': cantidadItem
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

    this.updateDetalleFactura = function (detaleFactura) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/detalle/update';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(detaleFactura),
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

    this.deleteDetalleFactura = function (detaleFactura, dni, pw) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/detalle/delete';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(detaleFactura),
            params: {
                'dni': dni,
                'password': pw
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

    this.deleteDiscount = function (detalleFactura, dni, pw) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/detalle/delete/discount';
        $http({
            url: uri,
            method: 'post',
            params: {
                'dni': dni,
                'password': pw
            },
            data: angular.toJson(detalleFactura),
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

    this.getDayDetalleFactura = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/detalle/day';
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

});

