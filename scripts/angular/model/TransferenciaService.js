miAppHome.service('transferenciaService', function ($q, $http, cookieService) {

    this.getAll = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/transferencia/all';
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

    this.getDaily = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/transferencia/day';
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

    this.getMonth = function () {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/transferencia/month';
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

    this.getById = function (idTransferencia) {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/transferencia/id';
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
    
    this.add = function (transferencia) {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/transferencia/add';
        var token = cookieService.get('token');
        console.log(transferencia);
        token.then(function (data) {
            $http({
                url: uri,
                method: 'post',
                data: angular.toJson(transferencia),
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
    
    this.update = function (transferencia) {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/transferencia/update';
        var token = cookieService.get('token');
        token.then(function (data) {
            $http({
                url: uri,
                method: 'post',
                data: angular.toJson(transferencia),
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

});

