miAppHome.service('sessionProvider', function (localStorageService) {
    this.getPath = function () {
        var role = localStorageService.get('path');
        var path = null;
        switch (role) {
            case 'admin':
                path = 'views/navbar2.html';
                break;
            case 'vendedor':
                break;
            case 'cajero':
                break;
            case 'contador':
                break;
            case 'repositor':
                break;
            case 'encargado/vendedor':
                break;
        }
        return path;
    };
});