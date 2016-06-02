/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.service('UsuarioService', function ($http, $q, $rootScope, $cookies, cookieService) {

    this.getListaUsuarios = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/list';
        var token = cookieService.get('token');
        token.then(function (data) {
            console.log(data);
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
        var token = $cookies.getObject('token');
        var url = 'https://tierradecoloresapi.herokuapp.com/usuarios/detail';
        var token = cookieService.get('token');
        token.then(function (data) {
            $http({
                url: url,
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
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/addUsuario';
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
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/updateUsuario';
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
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/changePassword';
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

    this.changeStatus = function (status, usuarios) {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/changeStatus';
        var token = cookieService.get('token');
        token.then(function (data) {
            $http({
                url: uri,
                method: 'post',
                data: angular.toJson(usuarios),
                headers: {
                    'Authorization': 'Bearer ' + data,
                    'Content-Type': 'application/json'
                },
                params: {
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

    this.getListRol = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/rol/list';
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
        var uri = 'https://tierradecoloresapi.herokuapp.com/usuarios/sucursal/list';
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
});

