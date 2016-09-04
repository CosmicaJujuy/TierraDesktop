(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .provider('colorConf', colorConfProvider);

    colorConfProvider.$inject = [];

    function colorConfProvider() {

        var palette = {
            primaryPalette: 'blue',
            warnPalette: 'red',
            accentPalette: 'yellow',
            backgroundPalette: 'grey',
            dark: false
        };
        var Config = require('electron-config');
        var config = new Config();
        this.colorPalette = function () {
            if (typeof config.get('Color') === 'undefined') {
                console.log("Colores reconfigurados");
                config.set('Color', palette);
            }
            return config.get('Color');
        };

        this.$get = [
            function colorConfFactory() {
                return new colorConfLauncher(colorPalette);
            }
        ];
    }

})();    