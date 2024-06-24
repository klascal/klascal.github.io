// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell, dialog, Menu, Notification } = require('electron/main')
const path = require('node:path')

let mainWindow

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('klascal', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('klascal')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
  })

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('https://klascal.github.io/', pageDirectory, 'index.html')
  shell.openExternal(pagePath)
})

const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click () { console.log('New Window') }
  }, {
    label: 'New Window with Settings',
    submenu: [
      { label: 'Basic' },
      { label: 'Pro' }
    ]
  },
  { label: 'New Command...' }
])

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu)
  }
}).then(createWindow)//.then(showNotification)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//const NOTIFICATION_TITLE = 'Basic Notification'
//const NOTIFICATION_BODY = 'Notification from the Main process'

//function showNotification () {
  //new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
//}


//app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') {
    //app.quit()
  //}
//})