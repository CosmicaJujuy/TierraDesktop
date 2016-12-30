'use strict';
var packager = require('electron-packager');
var options = {
    'arch': 'ia32',
    'platform': 'win32',
    'dir': './',
    'app-copyright': 'Paulo Galdo',
    'app-version': '2.2.5',
    'asar': true,
    'icon': './app.ico',
    'name': 'TierraDesktop',
    'out': './releases',
    'overwrite': true,
    'prune': true,
    'version': '1.4.13',
    'version-string': {
        'CompanyName': 'Paulo Galdo',
        'FileDescription': 'Tierra de colores', /*This is what display windows on task manager, shortcut and process*/
        'OriginalFilename': 'TierraDesktop',
        'ProductName': 'Tierra de colores',
        'InternalName': 'TierraDesktop'
    }
};
packager(options, function done_callback(err, appPaths) {
    console.log("Error: ", err);
    console.log("appPaths: ", appPaths);
});
