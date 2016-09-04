(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('fiscalService', fiscalService);
    fiscalService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function fiscalService($q, $http, cookieService, BaseURL) {

        var Auth = {
            'usuario': 'AFIP_SMH/P-441F',
            'password': 'T13RR4$7j15vker4L-L'
        };

        this.printer = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = 'http://localhost:8888/HasarPrinterAPI-0.5/oauth/token';
            $http({
                ignoreLoadingBar: true,
                url: uri,
                method: 'post',
                headers: {
                    'Authorization': 'Basic U1RBVElPTl9TTUgvUC00NDFGOjQwMTNGRFRZMzAyMw==',
                    'Content-type': 'application/json'
                },
                params: {
                    username: Auth.usuario,
                    password: Auth.password,
                    grant_type: 'password'
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

        this.connection = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = 'http://localhost:8085/HasarPrinterAPI-0.5/fiscal/connection';
            var token = cookieService.get('ptk');
            token.then(function (data) {
                $http({
                    ignoreLoadingBar: true,
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

        this.factura_a = function (listaDetalles) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = 'http://localhost:8888/HasarPrinterAPI-0.5/fiscal/factura/A';
            var token = cookieService.get('ptk');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(listaDetalles),
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
        
        this.factura_b = function (listaDetalles) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = 'http://localhost:8888/HasarPrinterAPI-0.5/fiscal/factura/B';
            var token = cookieService.get('ptk');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(listaDetalles),
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

        this.ticket = function (listaDetalles) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = 'http://localhost:8888/HasarPrinterAPI-0.5/fiscal/ticket';
            var token = cookieService.get('ptk');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(listaDetalles),
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

        this.comprobanteZ = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = 'http://localhost:8085/HasarPrinterAPI-0.5/fiscal/comprobante/Z';
            var token = cookieService.get('ptk');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
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