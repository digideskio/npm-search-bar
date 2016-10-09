const { app, Tray, BrowserWindow } = require('electron')
  , path = require('path')
  , assetsDirectory = path.join(__dirname, 'assets')

// For dev...
// require('electron-debug')({showDevTools: true});

// Establish objects...
let tray = window = undefined

// Don't show the app in the doc, since it's a tray app
app.dock.hide()

// Bootstrap...
app.on('ready', () => {
  createTray()
  createWindow()
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

// Create it
const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'ns-icon.png'))
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })
}

// Center it
const getWindowPosition = () => {
  
  const windowBounds = window.getBounds()
    , trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}

// Create it
const createWindow = () => {
  window = new BrowserWindow({
    width: 320,
    height: 320,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })
  
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

// Toggle it
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

// Show it
const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

