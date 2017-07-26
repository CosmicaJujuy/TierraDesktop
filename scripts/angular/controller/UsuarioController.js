(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .controller('UsuarioController', UsuarioController);

    UsuarioController.$inject = ['$scope', 'BaseURL', '$mdDialog', 'ngDialog', 'NgTableParams', 'cookieService',
        '$state', 'toaster', '$timeout', 'Upload', 'UsuarioService', '$rootScope', '$window'];

    function UsuarioController($scope, BaseURL, $mdDialog, ngDialog, NgTableParams, cookieService,
            $state, toaster, $timeout, Upload, UsuarioService, $rootScope, $window) {
        var vm = this;
        /*VARIABLES*/
        vm.user = {
            "idUsuario": null,
            "roles": null,
            "nombre": null,
            "apellido": null,
            "fechaNacimiento": null,
            "dni": null,
            "email": null,
            "telefono": null,
            "domicilio": null,
            "provincia": null,
            "username": null,
            "password": null,
            "imagen": null,
            "estado": true,
            "fechaCreacion": null,
            "fechaModificacion": null,
            "ultimaConexion": null,
            "idUsuarioCreacion": null,
            "idUsuarioModificacion": null,
            "usuarioSucursal": null
        };
        vm.userPw = {
            "old": "",
            "new": "",
            "rep": ""
        };
        /*METODOS*/
        vm.actualizarFoto = actualizarFoto;
        vm.actualizarPerfil = actualizarPerfil;
        vm.cambiarEstado = cambiarEstado;
        vm.cambiarPassword = cambiarPassword;
        vm.cambiarRol = cambiarRol;
        vm.cambiarSucursal = cambiarSucursal;
        vm.confirmarCambiarEstado = confirmarCambiarEstado;
        vm.detailUsuario = detailUsuario;
        vm.listaUsuarios = listaUsuarios;
        vm.listaRol = listaRol;
        vm.listaRoles = listaRoles;
        vm.listaSucursales = listaSucursales;
        vm.nuevoUsuario = nuevoUsuario;

        function actualizarFoto(file) {
            if (typeof file !== 'undefined') {
                var uri = BaseURL + 'usuarios/updatePhoto';
                var token = cookieService.get('token');
                token.then(function (data) {
                    Upload.upload({
                        url: uri,
                        headers: {'Authorization': 'Bearer ' + data},
                        data: {file: file}
                    }).then(function (resp) {
                    }, function (resp) {
                    });
                });
            }
            $timeout(function timer() {
                $state.go($state.current, {}, {reload: true});
                $timeout(function timer() {
                    $state.go('perfil');
                }, 1500);
            }, 2000);
        }

        function actualizarPerfil(user) {
            UsuarioService
                    .updateUsuario(user)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Datos actualizados.',
                                showCloseButton: false
                            });
                            $state.go('perfil');
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: "¡Op's algo paso!, comunicate con el administrador.",
                                showCloseButton: false
                            });
                        }
                    });
        }

        function cambiarEstado(usuario) {
            ngDialog.open({
                template: 'views/usuario/modal-cambiar-status.html',
                className: 'ngdialog-theme-sm',
                showClose: false,
                controller: 'UsuarioController as vm',
                closeByDocument: false,
                closeByEscape: true,
                data: {usuario: usuario}
            });
        }

        function cambiarPassword(newPassword) {
            UsuarioService
                    .changePassword(newPassword)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            toaster.pop({
                                type: 'success',
                                title: 'Exito',
                                body: 'Contraseña actualizada.',
                                showCloseButton: false
                            });
                            $state.go('perfil');
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: datos.data.msg,
                                showCloseButton: false
                            });
                        }
                    });
        }

        function cambiarRol(ev, usuario) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/usuario/modal-cambiar-rol.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: true,
                locals: {usuario: usuario}
            });
            function DialogController($scope, $mdDialog, usuario, UsuarioService, $rootScope) {
                $scope.items = usuario;
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.confirmarCambiarRol = function (idUsuario, rol) {
                    UsuarioService
                            .changeRol(idUsuario, rol)
                            .then(function (datos) {
                                $mdDialog.hide();
                                if (datos.status === 200) {
                                    toaster.pop({
                                        type: 'success',
                                        title: 'Exito',
                                        body: 'Rol actualizado.',
                                        showCloseButton: false
                                    });
                                    $rootScope.$broadcast('reloadUsuarios', {});
                                } else {
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Error',
                                        body: datos.data.msg,
                                        showCloseButton: false
                                    });
                                }
                            });
                };
            }
        }

        function cambiarSucursal(ev, usuario) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/usuario/modal-cambiar-sucursal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: true,
                locals: {usuario: usuario}
            });
            function DialogController($scope, $mdDialog, usuario, UsuarioService, $rootScope) {
                $scope.items = usuario;
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.confirmarCambiarSucursal = function (idUsuario, sucursal) {
                    UsuarioService
                            .changeSucursal(idUsuario, sucursal)
                            .then(function (datos) {
                                $mdDialog.hide();
                                if (datos.status === 200) {
                                    toaster.pop({
                                        type: 'success',
                                        title: 'Exito',
                                        body: 'Sucursal actualizada.',
                                        showCloseButton: false
                                    });
                                    $rootScope.$broadcast('reloadUsuarios', {});
                                } else {
                                    toaster.pop({
                                        type: 'error',
                                        title: 'Error',
                                        body: 'No se ha podido cambiar de sucursal.',
                                        showCloseButton: false
                                    });
                                }
                            });
                };
            }
        }

        function confirmarCambiarEstado(status, idUsuario) {
            UsuarioService
                    .changeStatus(status, idUsuario)
                    .then(function (datos) {
                        ngDialog.closeAll();
                        if (datos.status === 200) {
                            $rootScope.$broadcast('reloadUsuarios', {});
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: datos.data.msg,
                                showCloseButton: false
                            });
                        }
                    });
        }

        function detailUsuario() {
            UsuarioService
                    .getDetailUser()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            if ($state.current.name === 'perfil') {
                                vm.user = datos.data;
                            } else {
                                vm.user = datos.data;
                                var stringDni = datos.data.dni;
                                var splited = datos.data.fechaNacimiento.split("-");
                                var date = new Date(splited[0], splited[1] - 1, splited[2]);
                                vm.user.fechaNacimiento = date;
                                vm.user.dni = stringDni.toString();
                            }
                        }
                    });
        }

        function listaUsuarios() {
            $scope.usuarios = [];
            UsuarioService
                    .getListaUsuarios()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.usuarios = datos.data;
                            var data = datos.data;
                            $scope.tableUsuarios = new NgTableParams({
                                page: 1,
                                count: ($window.innerHeight > 734) ? 22 : 12
                            }, {
                                total: data.length,
                                getData: function (params) {
                                    data = $scope.usuarios;
                                    params.total(data.length);
                                    if (params.total() <= ((params.page() - 1) * params.count())) {
                                        params.page(1);
                                    }
                                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                }});
                        }
                    });
        }

        function listaRol() {
            $scope.roles = "";
            UsuarioService
                    .getListRol()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.roles = datos.data;
                        }
                    });
        }

        function listaRoles() {
            $scope.roles = "";
            UsuarioService
                    .getListRol()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            datos.data.shift();
                            $scope.roles = datos.data;
                        }
                    });
        }

        function listaSucursales() {
            $scope.sucursales = "";
            UsuarioService
                    .getListSucursales()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.sucursales = datos.data;
                        }
                    });
        }

        function nuevoUsuario(usuario) {
            usuario.provincia = "San Salvador de Jujuy";
            UsuarioService
                    .addUsuario(usuario)
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $state.go('usuarios');
                            $timeout(function timer() {
                                toaster.pop({
                                    type: 'success',
                                    title: 'Exito',
                                    body: 'Usuario agregado con exito.',
                                    showCloseButton: false
                                });
                            }, 2000);
                        } else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: datos.data.msg,
                                showCloseButton: false
                            });
                        }
                    });
        }

        $scope.$on('reloadUsuarios', function () {
            UsuarioService
                    .getListaUsuarios()
                    .then(function (datos) {
                        $scope.usuarios = datos.data;
                        $scope.tableUsuarios.reload();
                    });
        });

    }

})();