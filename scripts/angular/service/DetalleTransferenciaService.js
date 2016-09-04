(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('detalleTransferenciaService', detalleTransferenciaService);
    detalleTransferenciaService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function detalleTransferenciaService($q, $http, cookieService, BaseURL) {

        this.getDetalleTransferencia = function (idTransferencia) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'transferencia/detalle/trans';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        idTransferencia: idTransferencia
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

        this.add = function (item) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'transferencia/detalle/add';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(item),
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

        this.update = function (item) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'transferencia/detalle/update';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(item),
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

        this.delete = function (item) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'transferencia/detalle/delete';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(item),
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

        this.findByParams = function (params) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'transferencia/detalle/search';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    params: {
                        descripcion: params.descripcion,
                        marca: params.marca,
                        talla: params.talla,
                        codigo: params.codigo,
                        categoria: params.categoria,
                        sucursal: params.sucursal
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