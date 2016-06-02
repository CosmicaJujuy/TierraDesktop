miAppHome.service('sessionProvider', function (localStorageService) {
    this.getPath = function () {
        var path = "admin";
//        console.log(path);
        return path;
    };
});