(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .run(run);

    run.$inject = ['$rootScope', 'hotkeys', '$state', '$window'];

    function run($rootScope, hotkeys, $state, $window) {
        var session = require('electron').remote.session;
        var ses = session.fromPartition('persist:name');
        ses.clearCache(function (response) {
            /*console.log("Cache eliminado: ", response);*/
        });
        console.log();
        if($window.innerHeight === 730){
            $rootScope.height = "87.9%";
        }else if($window.innerHeight === 1042){
            $rootScope.height = "952px";
        }
        ses.cookies.get({name: 'token'}, function (error, cookies) {
            /* console.log(cookies[0]);
             console.log(cookies[0].value);*/
        });

    }

})();