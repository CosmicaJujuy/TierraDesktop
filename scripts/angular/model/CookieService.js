(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('cookieService', cookieService);
    cookieService.$inject = ['$q', 'BaseURL'];

    function cookieService($q, BaseURL) {

        var session = require('electron').remote.session;
        var ses = session.fromPartition('persist:name');

        this.get = function (name) {
            var value = {name: name};
            var datosRecu = null;
            var deferred = $q.defer();
            ses.cookies.get(value, function (error, cookies) {
                datosRecu = cookies[0].value;
                deferred.resolve(datosRecu);
            });
            return deferred.promise;
        };

        this.put = function (data, name) {
            var expiration = new Date();
            var hour = expiration.getHours();
            hour = hour + 6;
            expiration.setHours(hour);
            ses.cookies.set({
                url: BaseURL,
                name: name,
                value: data,
                expirationDate: expiration.getTime()
            }, function (error) {
            });
        };

        this.removeAll = function () {
            ses.clearStorageData([], function (data) {
                console.log(data);
            });
        };
    }
})();
