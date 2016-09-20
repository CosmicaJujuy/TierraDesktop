(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('settingService', settingService);

    settingService.$inject = ['$q', 'localStorageService'];

    function settingService($q, localStorageService) {
        var Config = require('electron-config');
        var config = new Config();

        this.setColor = function (palette) {
            config.set('Color', palette);
        };
    }
})();
