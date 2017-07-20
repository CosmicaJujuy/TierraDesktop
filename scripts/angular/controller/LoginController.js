(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('LoginController', LoginController);

    LoginController.$inject = ['localStorageService', '$timeout', '$state', 'toaster', 'LoginService', 'cookieService'];

    function LoginController(localStorageService, $timeout, $state, toaster, LoginService, cookieService) {
        var vm = this;
        var electron = require('electron');
        var window = electron.remote.getCurrentWindow();
        /*VARIABLES*/
        vm.usuario = {username: '', password: ''};
        /*METODOS*/
        vm.iniciarSesion = iniciarSesion;

        function iniciarSesion() {
            LoginService
                    .getAccess(vm.usuario)
                    .then(function (datos) {
                        switch (datos.status) {
                            case 200:
                                cookieService.put(datos.data.access_token, 'token');
                                window.setResizable(true);
                                window.setMaximizable(true);
                                var role = datos.data.role[0].authority.toString();
                                switch (role.valueOf()) {
                                    case "ROLE_ADMIN":
                                        localStorageService.set('path', 'admin');
                                        break;
                                    case "ROLE_VENDEDOR":
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
                                    default :
                                        console.log(role);
                                        break;
                                }
                                window.hide();
                                $state.go('home');
                                $timeout(function timer() {
                                    window.maximize();
                                    window.show();
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
        }

    }

})();

