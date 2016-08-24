(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .controller('LoadingController', LoadingController);

    LoadingController.$inject = ['$interval', '$timeout', '$http', 'toaster', '$state', 'localStorageService'];

    function LoadingController($interval, $timeout, $http, toaster, $state, localStorageService) {
        var vm = this;
        vm.cont = 0;
        vm.timer = 0;
        vm.query = false;
        vm.determinate = true;
        vm.determinateCount = 10;
        vm.indeterminate = true;
        vm.setting = true;
        vm.url = true;
        vm.text = false;
        vm.guardarBaseUrl = guardarBaseUrl;
        vm.messagge = "Cargando componentes";
        var msg = "";
        var firstPromise;
        var secondPromise;

        function guardarBaseUrl(url) {
            secondPromise = $interval(function () {
                vm.messagge = "Probando conexión";
                vm.text = false;
                vm.url = true;
                vm.determinate = false;
                vm.determinateCount += 1;
                if (vm.determinateCount > 100)
                    vm.determinateCount = 99;
            }, 50, 0, true);
            $http({
                url: url,
                method: 'GET',
                ignoreLoadingBar: true,
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(function successCallback(response) {
                var data = {BaseUrl: url};
                localStorageService.set('BaseURL', data);
                $interval.cancel(secondPromise);
                $timeout(function timer() {
                    vm.determinateCount = 100;
                    vm.url = true;
                }, 1000);
                $timeout(function timers() {
                    vm.query = false;
                    vm.determinate = true;
                    vm.text = false;
                }, 1500);
                vm.messagge = "Terminando de configurar la aplicación";
                $timeout(function timerss() {
                    relaunch();
                }, 8000);
            }, function errorCallback(response) {
                $interval.cancel(secondPromise);
                $timeout(function timer() {
                    vm.determinateCount = 100;
                }, 1000);
                $timeout(function timers() {
                    vm.url = false;
                    vm.determinate = true;
                    vm.determinateCount = 10;
                    vm.text = true;
                }, 1500);
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: "Revisa la dirección URL ingresada.",
                    showCloseButton: false
                });
            });
        }

        function relaunch() {
            var electron = require('electron');
            var setup = {firstUse: true};
            localStorageService.set('setup', setup);
            toaster.pop({
                type: 'success',
                title: '¡Exito!',
                body: "La aplicación se recargara.",
                showCloseButton: false
            });
            $timeout(function timer() {
                electron.remote.app.relaunch({args: process.argv.slice(1) + ['--relaunch']});
                electron.remote.app.exit(0);
            }, 3000);
        }

        firstPromise = $interval(function () {
            vm.timer++;
            vm.cont = ++vm.cont % 4;
            if (vm.timer < 30) {
                vm.messagge = "Cargando componentes";
            }
            if (vm.timer > 30 && vm.timer < 60) {
                vm.query = true;
                vm.indeterminate = false;
                vm.messagge = "Preparando aplicación";
            }
            if (vm.timer > 60) {
                vm.query = true;
                vm.text = true;
                vm.indeterminate = true;
                $interval.cancel(firstPromise);
                $timeout(function timer() {
                    vm.url = false;
                }, 1000);
            }
        }, 700, 0, true);
    }

})();