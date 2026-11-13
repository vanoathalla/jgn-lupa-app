const {
  app,
  BrowserWindow,
  Notification,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  shell,
} = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
let tray
let isQuitting = false

// ─── Paths ────────────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// When packaged, extra resources go to process.resourcesPath
function getResourcePath(filename) {
  if (isDev) return path.join(__dirname, 'public', filename)
  return path.join(process.resourcesPath, filename)
}

const ICON_PATH = getResourcePath('icon.ico')
const TRAY_ICON_PATH = getResourcePath('tray-icon.ico')
const DATA_PATH = isDev
  ? path.join(__dirname, 'reminders-data.json')
  : path.join(app.getPath('userData'), 'reminders-data.json')

// ─── Window ───────────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 380,
    minHeight: 500,
    frame: false,
    transparent: false,
    backgroundColor: '#0f0f13',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    icon: fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
    show: false,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Minimize to tray instead of closing
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      mainWindow.hide()
      showTrayBalloon('Jgn Lupa masih berjalan', 'App disembunyikan ke tray. Pengingat tetap aktif.')
    }
  })
}

// ─── Tray ─────────────────────────────────────────────────────────────────────
function createTray() {
  // Use a simple generated icon if no file exists
  const iconPath = fs.existsSync(TRAY_ICON_PATH) ? TRAY_ICON_PATH : ICON_PATH
  const icon = fs.existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
    : nativeImage.createEmpty()

  tray = new Tray(icon)
  tray.setToolTip('Jgn Lupa — Pengingat aktif')

  updateTrayMenu()

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })
}

function updateTrayMenu(pendingCount = 0) {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Jgn Lupa',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: pendingCount > 0
        ? `${pendingCount} pengingat aktif`
        : 'Tidak ada pengingat aktif',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Buka Aplikasi',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      },
    },
    {
      label: 'Keluar',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])
  tray?.setContextMenu(contextMenu)
}

function showTrayBalloon(title, body) {
  if (tray && process.platform === 'win32') {
    tray.displayBalloon({
      iconType: 'info',
      title,
      content: body,
    })
  }
}

// ─── Alarm Notification ───────────────────────────────────────────────────────
function fireAlarm(reminder) {
  // 1. Windows native notification
  if (Notification.isSupported()) {
    const notif = new Notification({
      title: `Jgn Lupa: ${reminder.title}`,
      body: reminder.description || 'Waktunya!',
      urgency: 'critical',
      timeoutType: 'never',
      icon: fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
      actions: [{ type: 'button', text: 'Buka App' }],
    })

    notif.on('click', () => {
      mainWindow?.show()
      mainWindow?.focus()
    })

    notif.on('action', () => {
      mainWindow?.show()
      mainWindow?.focus()
    })

    notif.show()
  }

  // 2. Tray balloon (extra visibility on Windows)
  showTrayBalloon(`Pengingat: ${reminder.title}`, reminder.description || 'Waktunya!')

  // 3. Tell renderer to play alarm sound
  if (mainWindow) {
    mainWindow.webContents.send('play-alarm')
  }
}

// ─── Background reminder checker ──────────────────────────────────────────────
let firedIds = new Set()

function checkReminders() {
  try {
    if (!fs.existsSync(DATA_PATH)) return

    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const reminders = JSON.parse(raw)
    const now = Date.now()

    let pendingCount = 0

    reminders.forEach(r => {
      if (r.done) return
      pendingCount++

      const reminderTime = new Date(r.datetime).getTime()
      const diff = reminderTime - now

      // Fire if within the last 60 seconds and not yet fired
      if (diff <= 0 && diff > -60000 && !firedIds.has(r.id)) {
        firedIds.add(r.id)
        fireAlarm(r)
      }
    })

    updateTrayMenu(pendingCount)
  } catch (err) {
    // Silent fail — data might be in-flight
  }
}

// ─── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  // Auto-start with Windows (when installed)
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true, // start minimized to tray
    })
  }

  createWindow()
  createTray()

  // Check reminders every 15 seconds
  setInterval(checkReminders, 15000)
  checkReminders() // immediate first check

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit — stay in tray
  }
})

// ─── IPC handlers ─────────────────────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow?.minimize())
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window-close', () => mainWindow?.hide())

ipcMain.on('show-notification', (_, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show()
  }
})

// Renderer saves data here so background checker can read it
ipcMain.on('save-reminders', (_, remindersJson) => {
  try {
    fs.writeFileSync(DATA_PATH, remindersJson, 'utf-8')
  } catch (err) {
    console.error('Failed to save reminders:', err)
  }
})

ipcMain.on('reminder-fired', (_, id) => {
  firedIds.add(id)
})
