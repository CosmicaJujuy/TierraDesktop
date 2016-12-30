(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .run(run);

    run.$inject = ['$rootScope', 'hotkeys', '$state'];

    function run($rootScope, hotkeys, $state) {
        var session = require('electron').remote.session;
        var ses = session.fromPartition('persist:name'); 
        ses.clearCache(function (response) {
            /*console.log("Cache eliminado: ", response);*/
        });

        ses.cookies.get({name: 'token'}, function (error, cookies) {
            /* console.log(cookies[0]);
             console.log(cookies[0].value);*/
        });

    }

})();