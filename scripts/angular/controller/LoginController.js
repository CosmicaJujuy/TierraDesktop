/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
miAppHome.controller('LoginController',
        function ($scope, localStorageService, $timeout, $state, toaster, LoginService, $location, $rootScope, $cookies, cookieService) {

            $scope.usuario = {username: '', password: ''};
            $scope.go = function (path) {
                $location.path(path);
            };
            $rootScope.navbar;
            $scope.iniciarSesion = function () {
                $promesa = LoginService.getAccess($scope.usuario);
                $promesa.then(function (datos) {
                    switch (datos.status) {
                        case 200:
                            cookieService.put(datos.data.access_token, 'token');
                            $rootScope.render = true;
                            localStorageService.set('session', 'views/navbar.html');
                            var electron = require('electron');
                            var window = electron.remote.getCurrentWindow();
                            window.setResizable(true);
                            window.setMaximizable(true);
                            var role = datos.data.role[0].authority;
                            switch (role) {
                                case 'ROLE_ADMIN':
                                    localStorageService.set('path', 'admin');
                                    break;
                                case 'ROLE_VENDOR':
                                    localStorageService.set('path', 'vendedor');
                                    break;
                                case "ROLE_CAJERO":
                                    localStorageService.set('path', 'cajero');
                                    break;
                                case "ROLE_CONTADOR":
                                    localStorageService.set('path', 'contador');
                                    break;
                                case "ROLE_REPOSITOR":
                                    localStorageService.set('path', 'repositor');
                                    break;
                                case "ROLE_ENCARGADO/VENDEDOR":
                                    localStorageService.set('path', 'encargado/vendedor');
                                    break;
                            }
                            window.hide();
                            $state.go('home');
                            $timeout(function timer() {
                                window.maximize();
                            }, 3000);
                            $timeout(function timer() {
                                toaster.pop({
                                    type: 'success',
                                    title: '¡Hola!',
                                    body: 'Bienvenido',
                                    showCloseButton: false
                                });
                            }, 6000);
                            break;
                        case 401:
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: 'No tienes autorizacion para ingresar.',
                                showCloseButton: false
                            });
                            break;
                        case 400:
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: 'Contraseña y/o usuario incorrectos.',
                                showCloseButton: false
                            });
                            break;
                        default:
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: "¡Op's algo paso!, comunicate con el administrador.",
                                showCloseButton: false
                            });
                    }
                });
            };

            $scope.logout = function () {
                $promesa = LoginService.logoutApi();
                $promesa.then(function (datos) {
                    if (datos.status === 200) {
                        $timeout(function timer() {
                            $state.go('login');
                        }, 2000);
                    }
                    toaster.pop({
                        type: 'info',
                        title: 'Adios',
                        body: 'Hasta luego :)',
                        showCloseButton: false
                    });
                });
            };

            $scope.back = function () {
                if ($rootScope.previousState !== "") {
                    $state.go($rootScope.previousState);
                } else {
                    $state.go('login.bar');
                }
            };
        });

