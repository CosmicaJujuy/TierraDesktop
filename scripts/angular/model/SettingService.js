miAppHome.service('settingService', function () {
    var storage = require('electron-json-storage');



    storage.has('BaseUrl', function (error, hasKey) {
        if (error) {
            throw error;
        }
        if (hasKey) {
            console.log('Configuración guardada apropiadamente.`');
        } else {
            console.log("Reconfiguración");
            storage.set('BaseUrl', {BaseUrl: 'https://tierradecoloresapi.herokuapp.com/'}, function (error) {
                console.log(error);
                if (error)
                    throw error;
            });
        }
    });

    storage.get('BaseUrl', function (error, data) {
        if (error)
            throw error;
        console.log(data);
    });
});

