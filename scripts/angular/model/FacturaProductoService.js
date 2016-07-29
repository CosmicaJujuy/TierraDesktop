(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('facturaProductoService', facturaProductoService);
    facturaProductoService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function facturaProductoService($q, $http, cookieService, BaseURL) {

        this.getAll = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'facturaProducto/list';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
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

        this.add = function (facturaProducto) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'facturaProducto/add';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(facturaProducto),
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

        this.update = function (facturaProducto) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'facturaProducto/update';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(facturaProducto),
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

        this.delete = function (facturaProducto) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'facturaProducto/delete';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(facturaProducto),
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

        this.detail = function (idFacturaProducto) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'facturaProducto/detail';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    params: {
                        "idFacturaProducto": idFacturaProducto
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

        this.finish = function (idFacturaProducto) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'facturaProducto/finish';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    params: {
                        "idFacturaProducto": idFacturaProducto
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