(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .run(run);

    run.$inject = ['$rootScope', 'hotkeys', '$state', '$window', '$location'];

    function run($rootScope, hotkeys, $state, $window, $location) {
        var session = require('electron').remote.session;
        var ses = session.fromPartition('persist:name');
        ses.clearCache(function (response) {
            /*console.log("Cache eliminado: ", response);*/
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            if ($window.innerHeight === 730) {
                $rootScope.height = "87.5%";
            } else if ($window.innerHeight > 1000) {
                $rootScope.height = "950px";
            } else {
                $rootScope.height = "87.5%";
            }
        });
        ses.cookies.get({name: 'token'}, function (error, cookies) {
            console.log(cookies[0].value);
        });

    }

})();