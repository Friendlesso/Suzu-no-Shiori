const { app, BrowserWindow, ipcMain } = require('electron');
let myWindow; // declare at top level so it's accessible
ipcMain.on('close-app', () => {
  if (myWindow) {
    myWindow.close();
  }
});
if (!app.isPackaged) {
  require('electron-reload')(__dirname);
}

app.whenReady().then(() => {
  myWindow = new BrowserWindow({
    width: 386,
    height: 326,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  myWindow.loadFile('index.html');
});

app.on('window-all-closed', () => {
  app.quit(); // ⬅️ This closes everything, even background processes
});