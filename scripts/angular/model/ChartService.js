/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.service('chartService', function ($http, $cookies, $q) {
    
    this.getEstadisticaVendedor = function (idVendedor) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/chart/vendedor/cantidad';
        $http({
            url: uri,
            method: 'get',
            params:{
                'idVendedor': idVendedor
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
    
    this.getVentasVendedor = function (idVendedor) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/chart/vendedor/ventas';
        $http({
            url: uri,
            method: 'get',
            params:{
                'idVendedor': idVendedor
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
    
    this.getMontoMedioPago = function (idMedioPago) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/chart/medio/ventas';
        $http({
            url: uri,
            method: 'get',
            params:{
                'idMedioPago': idMedioPago
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
    
    this.getCantidadMedioPago = function (idMedioPago) {
        var datosRecu = null;
        var deferred = $q.defer();
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/chart/medio/cantidad';
        $http({
            url: uri,
            method: 'get',
            params:{
                'idMedioPago': idMedioPago
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

