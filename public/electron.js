const { app, BrowserWindow,  ipcMain, dialog,  } = require("electron");
const path = require("path");
const fs = require("fs");

const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");

// autoUpdater.autoDownload = true;
// autoUpdater.autoRunAppAfterInstall=true
let win
let printer;
let splash;
function sendStatusToWindow(text) {
  // log.info(text);
  win.webContents.send('message', text);
  
}
function createWindow() {
  
  // Create the browser window.
  const splash = new BrowserWindow({
    icon: path.join(__dirname, "logo.png"),
    width: 295,
    height: 295,
    titleBarStyle: "hidden",
    transparent: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    show: false,
  });

  win = new BrowserWindow({
    width: 1200,
    height: 600,
    show: false,
    titleBarStyle:"hidden",
    icon: path.join(__dirname, "logo.png"),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // contextIsolation: true,
      // enableRemoteModule: true,
      // webSecurity:false
    },
  });
  // printer = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   show: false,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     preload: path.join(__dirname, "printer.js"),
  //   },
  // });

  // and load the index.html of the app.
  // win.loadFile(`${path.join(__dirname, 'index.html')}`);
  splash.loadURL(`file://${path.join(__dirname, "splash.html")}`);

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `${path.join("file://", __dirname, "../build/index.html")}`
  );
  // printer.loadURL(`${path.join("file://", __dirname, "printer.html")}`);

  splash.once("ready-to-show", () => {
    splash.center();
    splash.show();
  });

  win.webContents.on("did-finish-load", (e) => {});
  win.on("ready-to-show", () => {
    setTimeout(() => {
      win.show();
      splash.close();
      // autoUpdater.checkForUpdatesAndNotify();
    }, 5000);
    // setTimeout(updater.check, 5000);
  });
  // Open the DevTools.
  if (isDev) {
    // win.webContents.openDevTools({ mode: 'detach' });
    win.webContents.openDevTools();
    // printer.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
      })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
  });
});
// app.on('ready', function()  {
//   autoUpdater.checkForUpdatesAndNotify();
// });
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("minimize", (e) => {
  win.minimize();
});

ipcMain.on("maximize", (e) => {
  // win.restore()
  win.isMaximized() ? win.restore() : win.maximize();
});
ipcMain.on("close", (e) => {
  app.quit();
});
ipcMain.on("save", (e, arg) => {
  let filePath = "./src/data/data_.json";
  let data = JSON.stringify(arg);
  // const filePath = `${app.getPath("appData")}/data.json`;
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log(err, "file write error");
      return;
    }
    console.log("file write success", `${arg}`);
  
  });

  // console.log(arg);
  // win.close()
  app.quit();
});

// ipcMain.on("print", (e, content) => {
//   printer.webContents.send("print", content);
// });

// ipcMain.on("print-minute", (e) => {
//   printer.webContents.print({}, (success, failureReason) => {
//     if (!success) console.log(failureReason);

//     console.log("Print Initiate");
//   });
// });
// ------------------------------
// autoUpdater.on('error', (error) => {
//   dialog.showErrorBox('ErrorR: ', error == null ? "unknown" : (error.stack || error).toString())
// })

// autoUpdater.on('update-available', () => {
 
//   win.webContents.send('update-available',"'update-available'")
//   dialog.showMessageBox({
//     type: 'info',
//     title: ' Mise à jour',
//     message: 'Nouvelle mise à jour disponible, télécharger maintenant?',
//     buttons: ['Oui', 'Non']
//   }).then((buttonIndex) => {
//     if (buttonIndex === 0) {
//       autoUpdater.downloadUpdate()
//       win.webContents.send('downloadUpdate',"downloadUpdate")
//     }
//     else {
//      console.log("No Update");
//     }
//   })
// })

// autoUpdater.on('update-not-available', () => {
//   dialog.showMessageBox({
//     title: 'No Updates',
//     message: 'Current version is up-to-date.'
//   })
// })

// autoUpdater.on('update-downloaded', () => {
//   dialog.showMessageBox({
//     title: 'Mise à jour',
//     message: "Installation des mises à jour, l'application sera fermer..."
//   }).then(() => {
//     win.webContents.send('update-downloaded',"update-downloaded")
//     setImmediate(() => autoUpdater.quitAndInstall())
//   })
// })
// Use default printing options
// worker.webContents.printToPDF({}).then((data) {
//     fs.writeFile(pdfPath, data, function (error) {
//         if (error) {
//             throw error
//         }
//         shell.openItem(pdfPath)
//         event.sender.send('wrote-pdf', pdfPath)
//     })
// }).catch((error) => {
//    throw error;
// })

