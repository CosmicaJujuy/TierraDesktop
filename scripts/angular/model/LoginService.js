/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.service('LoginService', function ($http, $q, $cookies, $rootScope, $location) {

    this.getAccess = function (Auth) {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/oauth/token';
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
        var token = $cookies.getObject('token');
        var uri = 'https://tierradecoloresapi.herokuapp.com/oauth/logout';
        $http({
            url: uri,
            method: 'post',
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

    this.refreshToken = function (Token) {
        var uri = 'https://tierradecoloresapi.herokuapp.com/oauth/token';
        var request = $http({
            url: uri,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + Token,
                'Content-type': 'application/json'
            },
            params: {
                refresh_token: 'Bearer ' + Token,
                grant_type: 'refresh_token'}
        });
        return request;
    };

    this.isLogged = function () {
        var tk = $cookies.get('a_tk');
        $http({
            url: 'https://tierradecoloresapi.herokuapp.com/usuarios/logged',
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + tk,
                'Content-type': 'application/json'
            }
        }).then(function successCallback(response) {
            $rootScope.isLoggedIn = true;
        }, function errorCallback(response) {
            if (response.status === 401) {
                $rootScope.isLoggedIn = false;
                $location.path("/login");
            }
        });
    };
});


