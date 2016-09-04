(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('medioPagoService', medioPagoService);
    medioPagoService.$inject = ['$q', '$http', 'cookieService', 'BaseURL'];

    function medioPagoService($q, $http, cookieService, BaseURL) {

        this.getAll = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var uri = BaseURL + 'medio/list';
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

    }
})();