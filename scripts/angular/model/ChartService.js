(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('chartService', chartService);
    chartService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function chartService($q, $http, cookieService, BaseURL) {

        this.getEstadisticaVendedor = function (idVendedor) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'chart/vendedor/cantidad';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        'idVendedor': idVendedor
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
        this.getVentasVendedor = function (idVendedor) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'chart/vendedor/ventas';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        'idVendedor': idVendedor
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

        this.getMontoMedioPago = function (idMedioPago) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'chart/medio/ventas';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        'idMedioPago': idMedioPago
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

        this.getCantidadMedioPago = function (idMedioPago) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'chart/medio/cantidad';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        'idMedioPago': idMedioPago
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
