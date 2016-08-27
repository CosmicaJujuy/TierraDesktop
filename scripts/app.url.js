(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .value('BaseURL', BaseURL);
    function BaseURL() {
        var resource = 'http://';
        return resource;
    }
})();