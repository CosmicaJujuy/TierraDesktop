(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('metodoPagoFacturaService', metodoPagoFacturaService);
    metodoPagoFacturaService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function metodoPagoFacturaService($q, $http, cookieService, BaseURL) {

        this.getListaPago = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'pago/list';
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

        this.getListaPagoFactura = function (idFactura) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'pago/factura';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
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


        this.addMetodoPago = function (metodo) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'pago/add';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(metodo),
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

        this.getDay = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'pago/day';
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

    }
})();