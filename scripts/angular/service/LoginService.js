(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('LoginService', LoginService);
    LoginService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function LoginService($q, $http, cookieService, BaseURL) {

        this.getAccess = function (Auth) {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'oauth/token';
            $http({
                url: uri,
                method: 'post',
                headers: {
                    'Authorization': 'Basic bmF0dXJhYXBwOjEyMzQ1Ng==',
                    'Content-type': 'application/json'
                },
                params: {
                    username: Auth.username,
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

        this.logoutApi = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'oauth/logout';
            var token = cookieService.get('token');
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
