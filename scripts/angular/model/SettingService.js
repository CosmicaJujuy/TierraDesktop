(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('settingService', settingService);

    settingService.$inject = ['$q'];

    function settingService($q) {
        var storage = require('electron-json-storage');

        storage.has('BaseUrl', function (error, hasKey) {
            if (error) {
                throw error;
            }
            if (hasKey) {
                console.log('Configuración guardada apropiadamente.`');
            } else {
                console.log("Reconfiguración");
                storage.set('BaseUrl', {BaseUrl: 'https://tierradecoloresapi.herokuapp.com/'}, function (error) {
                    console.log(error);
                    if (error)
                        throw error;
                });
            }
        });


        this.getURL = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            storage.get('BaseUrl', function (error, data) {
                datosRecu = data;
                deferred.resolve(datosRecu);
            });
            return deferred.promise;
        };

        this.setURL = function (url) {
            var datosRecu = null;
            var deferred = $q.defer();
            storage.set('BaseUrl', {BaseUrl: url}, function (error) {
                if (error) {
                    throw error;
                } else {
                    datosRecu = true;
                    deferred.resolve(datosRecu);
                }
            });
            return deferred.promise;
        };
    }
})();
