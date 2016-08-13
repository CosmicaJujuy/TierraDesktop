var electronInstaller = require('electron-winstaller');
var path = require('path');
resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './releases/TierraDesktop-win32-ia32',
    outputDirectory: './Installer',
    authors: 'Paulo Galdo - Cósmica Tecnología.',
    owners: 'Paulo Galdo - Cósmica Tecnología.',
    description: 'Sistema de gestion comercial.',
    version: '2.0.8',
    setupIcon: path.join(__dirname, '/app.ico'),
    loadingGif: path.join(__dirname, '/balls.gif'),
    exe: 'TierraDesktop.exe',
    noMsi: true
});
resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
