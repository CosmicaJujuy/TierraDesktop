(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .filter('keyboardShortcut', keyboardShortcut);

    keyboardShortcut.$inject = ['$window'];

    function keyboardShortcut($window) {
        return function (str) {
            if (!str)
                return;
            var keys = str.split('-');
            var isOSX = /Mac OS X/.test($window.navigator.userAgent);
            var seperator = (!isOSX || keys.length > 2) ? '+' : '';
            var abbreviations = {
                M: isOSX ? 'âŒ˜' : 'Ctrl',
                A: isOSX ? 'Option' : 'Alt',
                S: 'Shift'
            };
            return keys.map(function (key, index) {
                var last = index === keys.length - 1;
                return last ? key : abbreviations[key];
            }).join(seperator);
        };
    }

})();