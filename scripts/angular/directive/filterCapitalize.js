(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .filter('capitalize', capitalize);

    capitalize.$inject = [];

    function capitalize() {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    }

})();