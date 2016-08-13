miAppHome.service('sessionProvider', function(localStorageService, hotkeys, $state) {
    this.getPath = function() {
        hotkeys.add({
            combo: 'ctrl+p',
            description: 'Perfil de usuario',
            callback: function(event, hotkey) {
                if ($state.current.name === 'login') {
                    event.preventDefault();
                } else {
                    $state.go('perfil');
                }
            }
        });
        var role = localStorageService.get('path');
        var path = null;
        if (role === 'admin' || role === 'vendedor' || role === 'cajero' || role === 'encargado/vendedor') {
            hotkeys.add({
                combo: 'shift+f',
                description: 'Panel de facturas y reservas',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('facturas');
                    }
                }
            });
            hotkeys.add({
                combo: 'shift+n',
                description: 'Panel notas de credito',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('nota_credito');
                    }
                }
            });
            hotkeys.add({
                combo: 'shift+t',
                description: 'Panel de transferencias',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('transferencias');
                    }
                }
            });
        }
        if (role === 'admin' || role === 'repositor') {
            hotkeys.add({
                combo: 'ctrl+s',
                description: 'Panel de productos y facturas',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('productos');
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+d',
                description: 'Panel de distribución',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('distribucion');
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+k',
                description: 'Panel de categorias',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('categorias');
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+n',
                description: 'Panel de marcas',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('marcas');
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+j',
                description: 'Panel tipos de producto',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('tipos');
                    }
                }
            });
            hotkeys.add({
                combo: 'shift+p',
                description: 'Panel de proveedores',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('proveedores');
                    }
                }
            });
        }
        if (role === 'admin' || role === 'contador') {
            hotkeys.add({
                combo: 'ctrl+b',
                description: 'Panel de entidades financieras',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('bancos');
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+t',
                description: 'Panel de tarjetas',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('tarjetas');
                    }
                }
            });
            hotkeys.add({
                combo: 'ctrl+y',
                description: 'Panel de planes de pago',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('pagos');
                    }
                }
            });
        }
        if (role === 'admin') {
            hotkeys.add({
                combo: 'ctrl+l',
                description: 'Lista de usuarios',
                callback: function(event, hotkey) {
                    if ($state.current.name === 'login') {
                        event.preventDefault();
                    } else {
                        $state.go('usuarios');
                    }
                }
            });
        }
        switch (role) {
            case 'admin':
                path = 'views/admin.html';
                break;
            case 'vendedor':
                path = 'views/cajero-vendedor-encargado.html';
                break;
            case 'cajero':
                path = 'views/cajero-vendedor-encargado.html';
                break;
            case 'contador':
                path = 'views/contador.html';
                break;
            case 'repositor':
                path = 'views/repositor.html';
                break;
            case 'encargado/vendedor':
                path = 'views/cajero-vendedor-encargado.html';
                break;
        }
        return path;
    };
});
