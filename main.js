// Main application code

const { app, Tray, BrowserWindow, globalShortcut, ipcMain, Menu } = require('electron')
  , path = require('path')
  , AutoLaunch = require('auto-launch')
  , storage = require('electron-json-storage')
  , assetsDirectory = path.join(__dirname, 'assets')
  ;
 
// For dev...
// require('electron-debug')({showDevTools: true});

// Establish objects...
let tray = window = contextMenu = appAutoLauncher = undefined 

// Don't show the app in the doc, since it's a tray app
app.dock.hide()

// Bootstrap...
app.on('ready', () => {
  
  createTray()
  createWindow()

  registerGlobalShortcuts()
  registerAutoLauncher()
  
  // Important to do this after...
  window.webContents.on('did-finish-load', () => {
    initializeUserPreferences()
  })

})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

// Create it
const createTray = () => {
  
  tray = new Tray(path.join(assetsDirectory, 'ns-icon.png'))
  
  tray.on('double-click', toggleWindow)

  tray.on('right-click', toggleWindow)

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

// Setting to enable npm search bar to run at startup
const toggleRunAtStartup = (isRunAtStartupEnabled) => {

    storage.get('userPreferences', function(err, object) {

      object = object || {}

      if(isRunAtStartupEnabled){
        // enable it
        appAutoLauncher.enable()
        object.isAutoLaunchEnabled = true
      }
      else{
        // disable it
        appAutoLauncher.disable()
        object.isAutoLaunchEnabled = false
      }

      // Write preferences
      storage.set('userPreferences', object, (err) => {
        if(err) console.error(err)
        console.log('updated userPreferences...')
      }) // end set userPreferences

    }) // end get userPreferences

} // end toggleRunAtStartup()

// Toggle it
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

// Show it
const showWindow = (isSeachBoxFocused) => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
  if(isSeachBoxFocused) focusSearchBox()
}

// Send message to browser to focus inside the search box
const focusSearchBox = () => { window.webContents.send('focus-search-box') }

const registerGlobalShortcuts = () => {
  
  const ret = globalShortcut.register('CommandOrControl+Shift+/', () => {
    showWindow(true)
  })

  if (!ret) {
    console.error('CommandOrControl+Shift+/ keyboard registration failed.')
  }
}

const registerAutoLauncher = () => {
  
  appAutoLauncher = new AutoLaunch({
    name: 'NPM Search Bar',
    path: '/Applications/npm-search-bar.app'
  })

}

const initializeUserPreferences = () => {

  let initialConfig = {isAutoLaunchEnabled: false}

  storage.has('userPreferences', function(error, hasKey) {
    if (error) console.error(error)

    if (!hasKey) {
      storage.set('userPreferences', initialConfig, function(err){
        if(err) console.error(err)
        console.log('Initialized userPreferences in storage.')
      }) // end set
    }
    else {
      storage.get('userPreferences', function(err,object) {
        if(err) return console.error(err)
        else window.webContents.send('set-preferences', object )
      })
    } // end else
  })  // end storage.has
}

ipcMain.on('quit-app', (event, arg) => {
  app.quit()
})

ipcMain.on('run-at-startup', (event, arg) => {
  toggleRunAtStartup(arg)
})
