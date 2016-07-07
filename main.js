//Importing modules to print and manage the app
const {ipcMain, Menu, shell, app, BrowserWindow} = require('electron');
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
        icon: __dirname + '/styles/images/app.png'
    });
    //mainWindow.setIcon( __dirname + '/styles/images/appIcon.png');
    
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', function () {
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