const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
  // Save reminders to disk so background checker can read them
  saveReminders: (json) => ipcRenderer.send('save-reminders', json),
  // Mark a reminder as fired (so it doesn't double-fire)
  markFired: (id) => ipcRenderer.send('reminder-fired', id),
  // Listen for play-alarm event from main
  onPlayAlarm: (callback) => {
    ipcRenderer.on('play-alarm', callback)
    return () => ipcRenderer.removeListener('play-alarm', callback)
  },
})
