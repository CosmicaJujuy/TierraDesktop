(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('distribucionService', distribucionService);
    distribucionService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function distribucionService($q, $http, cookieService, BaseURL) {

        this.getAll = function (idSucursal) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'stock/list';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    params: {
                        'idStock': idSucursal
                    },
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                }, function errorCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                });
            });
            return deferred.promise;
        };
        this.add = function (wrapper) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'stock/add';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(wrapper),
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                }, function errorCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                });
            });
            return deferred.promise;
        };
        this.getStockTierra = function (idFactura) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'stock/tierra/search';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    params: {
                        'idFactura': idFactura
                    },
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                }, function errorCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                });
            });
            return deferred.promise;
        };
        this.getStockBebelandia = function (idFactura) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'stock/bebelandia/search';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    params: {
                        'idFactura': idFactura
                    },
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                }, function errorCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                });
            });
            return deferred.promise;
        };
        this.getStockLibertador = function (idFactura) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'stock/libertador/search';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    params: {
                        'idFactura': idFactura
                    },
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                }, function errorCallback(response) {
                    datosRecu = response;
                    deferred.resolve(datosRecu);
                });
            });
            return deferred.promise;
        };

    }
})();