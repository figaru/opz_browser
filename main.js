const {app, BrowserWindow} = require('electron');
// In main process.
const {ipcMain} = require('electron')

let mainWindow;

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1600, height: 920, frame: false});
  mainWindow.loadURL('file://' + __dirname + '/main/browser.html');
  mainWindow.openDevTools();


  ipcMain.on('synchronous-message', (event, arg) => {
    app.quit();
    console.log(arg)  // prints "ping"
    event.returnValue = 'pong'
  });
});


