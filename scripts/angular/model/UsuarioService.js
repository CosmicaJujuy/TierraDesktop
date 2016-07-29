(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('UsuarioService', UsuarioService);
    UsuarioService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function UsuarioService($q, $http, cookieService, BaseURL) {

        this.getListaUsuarios = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/list';
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

        this.getDetailUser = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/detail';
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

        this.addUsuario = function (usuario) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/addUsuario';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(usuario),
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

        this.updateUsuario = function (usuario) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/updateUsuario';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(usuario),
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

        this.changePassword = function (usuario) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/changePassword';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        oldPw: usuario.old,
                        newPw: usuario.rep,
                        repPw: usuario.new
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

        this.changeStatus = function (status, idUsuario) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/changeStatus';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        idUsuario: idUsuario,
                        status: status
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

        this.changeSucursal = function (idUsuario, sucursal) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/changeSucursal';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(sucursal),
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        idUsuario: idUsuario
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

        this.changeRol = function (idUsuario, rol) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/changeRol';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'post',
                    data: angular.toJson(rol),
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        idUsuario: idUsuario
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

        this.getListRol = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/rol/list';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-Type': 'application/json'
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

        this.getListSucursales = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'usuarios/sucursal/list';
            var token = cookieService.get('token');
            token.then(function (data) {
                $http({
                    url: uri,
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + data,
                        'Content-Type': 'application/json'
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