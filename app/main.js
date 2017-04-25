/*var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // appIcon = new Tray('C:\Users\waliby\Pictures\mind_brain_thinking.png');
    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: 'Gestionnaire de partage.',
        'icon': __dirname + '/img/mind_brain_thinking.png',
        width: 800,
        height: 600,
        'skip-taskbar': false,
        center: true,
        minWidth: 480,
        minHeight: 160,
        webPreferences: {
          webSecurity: true
        }
        //,frame: false
      }
    );

    mainWindow.setMinimumSize(660, 450);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // En test
    mainWindow.setMenu(null);

    //var Menu = require('menu');
    //var MenuItem = require('menu-item');

    //menu = Menu.buildFromTemplate([]);
    //Menu.setApplicationMenu(null);
});*/


const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      title: 'Gestionnaire de partage.',
      'icon': __dirname + '/img/mind_brain_thinking.png',
      width: 800,
      height: 600,
      'skip-taskbar': false,
      center: true,
      minWidth: 480,
      minHeight: 160,
      webPreferences: {
        webSecurity: true
      }
      //,frame: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
