(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['LoginService', '$state', '$scope', 'toaster', '$timeout', 'localStorageService', '$mdDialog', 'settingService'];

    function NavbarController(LoginService, $state, $scope, toaster, $timeout, localStorageService, $mdDialog, settingService) {
        /*jshint validthis: true */
        var electron = require('electron');
        var vm = this;
        var window = electron.remote.getCurrentWindow();
        var session = require('electron').remote.session;
        var ses = session.fromPartition('persist:name');
        vm.changeSettings = function (ev) {
            if ($state.current.name === 'login') {
                $scope.modal = 'views/modal-login-settings.html';
            } else {
                $scope.modal = 'views/modal-settings.html';
            }
            var url = localStorageService.get('BaseURL');
            $mdDialog.show({
                controller: DialogController,
                templateUrl: $scope.modal,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
                locals: {url: url}
            });
            function DialogController(url, $scope, $timeout, toaster, localStorageService) {
                var Config = require('electron-config');
                var config = new Config();
                $scope.colores = [
                    'red', 'pink', 'purple',
                    'deep-purple', 'indigo', 'blue',
                    'light-blue', 'cyan', 'teal',
                    'green', 'light-green', 'lime',
                    'yellow', 'amber', 'orange',
                    'deep-orange', 'brown', 'grey', 'blue-grey'
                ];
                $scope.userPalette = config.get('Color');
                $scope.url = url;
                $scope.confirm = true;
                $scope.colorOculto = true;
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.updateURL = function (newUrl) {
                    var data = {BaseUrl: newUrl};
                    localStorageService.set('BaseURL', data);
                    if (url) {
                        $mdDialog.hide();
                        toaster.pop({
                            type: 'success',
                            title: '¡Exito!',
                            body: "La aplicación se recargara.",
                            showCloseButton: false
                        });
                        $timeout(function timer() {
                            ses.clearStorageData([], function (data) {
                                console.log("Cookies limpiadas: ", data);
                            });
                            electron.remote.app.relaunch({args: process.argv.slice(1) + ['--relaunch']});
                            electron.remote.app.exit(0);
                        }, 3000);
                    }
                };

                $scope.updateColor = function (palette) {
                    settingService.setColor(palette);
                    toaster.pop({
                        type: 'success',
                        title: '¡Exito!',
                        body: "La aplicación se recargara.",
                        showCloseButton: false
                    });
                    $timeout(function timer() {
                        window.reload();
                    }, 2000);
                };
            }
        };

        vm.goBack = function () {
            return window.webContents.goBack();
        };

        vm.logoutApp = function () {
            return LoginService.logoutApi()
                    .then(function (data) {
                        toaster.pop({
                            type: 'success',
                            title: '¡Adios!',
                            body: "Hasta luego.",
                            showCloseButton: false
                        });
                        return $timeout(function timer() {
                            window.close();
                        }, 3000);
                    });
        };

        vm.reloadPage = function () {
            return window.reload();
        };

    }
})();