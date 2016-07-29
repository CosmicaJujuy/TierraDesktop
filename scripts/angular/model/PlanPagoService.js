(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('planPagoService', planPagoService);
    planPagoService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function planPagoService($q, $http, cookieService, BaseURL) {

        this.getAll = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'plan/list';
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

        this.add = function (planPago) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'plan/add';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(planPago),
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

        this.update = function (planPago) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'plan/update';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(planPago),
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

        this.delete = function (planPago) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'plan/delete';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(planPago),
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

        this.searchByTarjeta = function (idTarjeta) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'plan/tarjeta';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        'idTarjeta': idTarjeta
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