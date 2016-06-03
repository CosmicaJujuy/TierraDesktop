/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.service('planPagoService', function ($http, $q, $cookies, $rootScope) {

    this.getAll = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/plan/list';
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

    this.add = function (planPago) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/plan/add';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(planPago),
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
    
    this.update = function (planPago) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/plan/update';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(planPago),
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
    
    this.delete = function (planPago) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/plan/delete';
        $http({
            url: uri,
            method: 'post',
            data: angular.toJson(planPago),
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
    
    this.searchByTarjeta = function (idTarjeta) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/plan/tarjeta';
        $http({
            url: uri,
            method: 'get',
            params:{
                'idTarjeta': idTarjeta
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

});

