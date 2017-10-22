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
            if (cookies[0].value) {
                console.log(cookies[0].value);
                $window.ws = 'http://localhost:8080/socket_tdc?access_token=' + cookies[0].value;
                var socket = new SockJS($window.ws);
                $window.Client = Stomp.over(socket);
                connectAndReconnectSocket($window.ws, function (frame) {
                    console.log('Connected: ' + frame);
                }, function (response) {
                    console.log(response);
                });

                function connectAndReconnectSocket(ws, successCallback, errorCallback) {
                    socket = new SockJS(ws);
                    $window.Client = Stomp.over(socket);
                    $window.Client.debug = null;
                    $window.Client.heartbeat.outgoing = 2000;
                    $window.Client.heartbeat.incoming = 2000;
                    $window.Client.connect({}, function (frame) {
                        return successCallback(frame);
                    }, function (response, data) {
                        setTimeout(function () {
                            console.log(response, data);
                            connectAndReconnectSocket($window.ws, null, null);
                        }, 5000);
                    });
                }
            }
        });
    }

})();