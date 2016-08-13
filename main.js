const {ipcMain, Menu, shell, app, BrowserWindow} = require('electron');
// this should be placed at top of main.js to handle setup events quickly
app.setName('Tierra de colores');
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

//Importing modules to print and manage the app

var os = require("os");
var fs = require("fs");
var path = require("path");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let workerWindow;

function createWindow() {
    /*MAIN WINDOWS*/
    mainWindow = new BrowserWindow({
        transparent: false,
        frame: false,
        fullscreen: false,
        width: 780,
        height: 350,
        resizable: false,
        movable: false,
        show: false,
        icon: __dirname + '/styles/images/app.png'
    });
    //mainWindow.setIcon( __dirname + '/styles/images/appIcon.png');
        
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('closed', function () {
        var windows = BrowserWindow.getAllWindows();
        windows.forEach(function(value) {
            if (value.getTitle() === 'Busqueda de productos') {
                value.close();
                value = null;
            }
        });
        mainWindow = null;
        workerWindow.close();
        workerWindow = null;
    });
    /*WORKER WINDOW*/
    workerWindow = new BrowserWindow({ show: false });
    workerWindow.loadURL(`file://${__dirname}/worker.html`);
    workerWindow.hide();
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on("printPDF", function (event, content) {
    workerWindow.webContents.send("printPDF", content);
});

app.on("open-url", function (event, content) {
    event.preventDefault();
});

/*TRIGGER PRINT FUNCTION, NEED CALIBRATE*/
ipcMain.on("printer", function (event) {
    workerWindow.webContents.print();
//    mainWindow.webContents.print();
});

ipcMain.on("readyToPrintPDF", function (event) {
    const pdfPath = path.join(os.tmpdir(), 'print.pdf');
    //    workerWindow.webContents.print({silent: true});
    workerWindow.webContents.printToPDF({}, function (error, data) {
        if (error) {
            throw error;
        }
        fs.writeFile(pdfPath, data, function (error) {
            if (error) {
                throw error;
            }
            shell.openItem(pdfPath);
            event.sender.send('wrote-pdf', pdfPath);
        })
    })
});