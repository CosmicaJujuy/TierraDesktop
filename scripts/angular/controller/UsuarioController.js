/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global miAppHome */

var usuarioController = miAppHome.controller('UsuarioController',
        ['$scope', 'BaseURL', '$mdDialog', 'ngDialog', 'NgTableParams', 'cookieService', '$state', '$window', 'toaster', '$timeout', '$cookies', 'Upload', '$location', 'UsuarioService', '$rootScope',
            function ($scope, BaseURL, $mdDialog, ngDialog, NgTableParams, cookieService, $state, $window, toaster, $timeout, $cookies, Upload, $location, UsuarioService, $rootScope) {

                $scope.user = {
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

                $scope.userPw = {
                    "old": "",
                    "new": "",
                    "rep": ""
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: null,
                    startingDay: 1
                };

                $scope.open2 = function () {
                    $scope.popup2.opened = true;
                };

                $scope.popup2 = {
                    opened: false
                };

                $scope.actualizarFoto = function (file) {
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
                        }, 1000);
                    }, 2000);
                };
                $scope.actualizarPerfil = function () {
                    if ($scope.user.estado !== 'INACTVO') {
                        $scope.user.estado = true;
                    } else {
                        $scope.user.estado = false;
                    }
                    $promesa = UsuarioService.updateUsuario($scope.user);
                    $promesa.then(function (datos) {
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
                };

                $scope.listaUsuarios = function () {
                    $scope.usuarios = [];
                    $promesa = UsuarioService.getListaUsuarios();
                    $promesa.then(function (datos) {
                        if (datos.status === 200) {
                            $scope.usuarios = datos.data;
                            var data = datos.data;
                            $scope.tableUsuarios = new NgTableParams({
                                page: 1,
                                count: 12
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
                };
                $scope.detailUsuario = function () {
                    $rootScope.edit = true;
                    $promesa = UsuarioService.getDetailUser();
                    $promesa.then(function (datos) {
                        if (datos.status === 200) {
                            if (datos.data.estado === true) {
                                datos.data.estado = 'Activo';
                            } else {
                                datos.data.estado = 'Inactivo';
                            }
                            if ($location.path() === '/home/perfil') {
                                $scope.user = datos.data;
                            } else {
                                $scope.user = datos.data;
                                var stringDni = datos.data.dni;
                                var splited = datos.data.fechaNacimiento.split("-");
                                var date = new Date(splited[0], splited[1] - 1, splited[2]);
                                $scope.user.fechaNacimiento = date;
                                $scope.user.dni = stringDni.toString();
                            }
                            if ($scope.user.roles.idRol === 1) {
                                $rootScope.edit = false;/*Falso para indicar que este en falso la directiva ng-hide*/
                            } else {
                                $rootScope.edit = true;
                            }
                        }
                    }).catch(function (fallback) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'No se ha podido conectar con el servidor.',
                            showCloseButton: false
                        });
                    });
                };


                $scope.nuevoUsuario = function (usuario) {
                    $scope.newUser = {
                        "idUsuario": null,
                        "roles": usuario.roles,
                        "nombre": usuario.nombre,
                        "apellido": usuario.apellido,
                        "fechaNacimiento": usuario.fechaNacimiento,
                        "dni": usuario.dni,
                        "email": usuario.email,
                        "telefono": usuario.telefono,
                        "domicilio": usuario.domicilio,
                        "provincia": "San Salvador de Jujuy",
                        "username": usuario.username,
                        "password": usuario.password,
                        "imagen": null,
                        "estado": false,
                        "fechaCreacion": null,
                        "fechaModificacion": null,
                        "ultimaConexion": null,
                        "idUsuarioCreacion": null,
                        "idUsuarioModificacion": null,
                        "usuarioSucursal": usuario.usuarioSucursal
                    };
                    $promesa = UsuarioService.addUsuario($scope.newUser);
                    $promesa.then(function (datos) {
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
                    }).catch(function (fallback) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'No se ha podido agregar usuario.',
                            showCloseButton: false
                        });
                    });
                };


                $scope.cambiarPassword = function () {
                    $promesa = UsuarioService.changePassword($scope.userPw);
                    $promesa.then(function (datos) {
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
                };



                $scope.cambiarEstado = function (usuario) {
                    ngDialog.open({
                        template: 'views/usuario/modal-cambiar-status.html',
                        className: 'ngdialog-theme-sm',
                        showClose: false,
                        controller: 'UsuarioController',
                        closeByDocument: false,
                        closeByEscape: true,
                        data: {usuario: usuario}
                    });
                };

                $scope.confirmarCambiarEstado = function (status, idUsuario) {
                    $promesa = UsuarioService.changeStatus(status, idUsuario);
                    $promesa.then(function (datos) {
                        ngDialog.closeAll();
                        if (datos.status === 200) {
                            $state.go($state.current, {}, {reload: true});
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

                $scope.listaRoles = function () {
                    $scope.roles = "";
                    $roles = UsuarioService.getListRol();
                    $roles.then(function (datos) {
                        if (datos.status === 200) {
                            datos.data.shift();
                            $scope.roles = datos.data;
                        }
                    });
                };

                $scope.listaRol = function () {
                    $scope.roles = "";
                    $roles = UsuarioService.getListRol();
                    $roles.then(function (datos) {
                        if (datos.status === 200) {
                            $scope.roles = datos.data;
                        }
                    });
                };

                $scope.listaSucursales = function () {
                    $scope.sucursales = "";
                    $sucursales = UsuarioService.getListSucursales();
                    $sucursales.then(function (datos) {
                        if (datos.status === 200) {
                            $scope.sucursales = datos.data;
                        }
                    });
                };


                $scope.cambiarSucursal = function (ev, usuario) {
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
                            $sucursal = UsuarioService.changeSucursal(idUsuario, sucursal);
                            $sucursal.then(function (datos) {
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
                };

                $scope.cambiarRol = function (ev, usuario) {
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
                            $rol = UsuarioService.changeRol(idUsuario, rol);
                            $rol.then(function (datos) {
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
                };

                $scope.$on('reloadUsuarios', function () {
                    $reload = UsuarioService.getListaUsuarios();
                    $reload.then(function (datos) {
                        $scope.usuarios = datos.data;
                        $scope.tableUsuarios.reload();
                    });
                });
            }]);
