import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'jgn-lupa-reminders'

const CATEGORIES = [
  { id: 'personal', label: 'Pribadi', color: '#8b5cf6' },
  { id: 'work', label: 'Kerja', color: '#3b82f6' },
  { id: 'health', label: 'Kesehatan', color: '#10b981' },
  { id: 'shopping', label: 'Belanja', color: '#f59e0b' },
  { id: 'other', label: 'Lainnya', color: '#ec4899' },
]

const isElectron = !!window.electronAPI

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// ─── Alarm sound (Web Audio API fallback for browser) ─────────────────────────
function playAlarmSound() {
  try {
    // Try the WAV file first
    const audio = new Audio('/alarm.wav')
    audio.volume = 1.0
    audio.play().catch(() => {
      // Fallback: synthesize beeps via Web Audio API
      playBeepFallback()
    })
  } catch {
    playBeepFallback()
  }
}

function playBeepFallback() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const beepTimes = [0, 0.4, 0.8]

    beepTimes.forEach(startTime => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime + startTime)
      osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + startTime + 0.25)

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime)
      gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + startTime + 0.02)
      gain.gain.setValueAtTime(0.6, ctx.currentTime + startTime + 0.22)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startTime + 0.3)

      osc.start(ctx.currentTime + startTime)
      osc.stop(ctx.currentTime + startTime + 0.3)
    })
  } catch {
    // Audio not available
  }
}

// ─── Web notification ─────────────────────────────────────────────────────────
async function requestNotificationPermission() {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}

function showWebNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const n = new Notification(title, {
      body: body || 'Waktunya!',
      icon: '/icon.svg',
      requireInteraction: true, // stays until dismissed
      tag: `jgn-lupa-${Date.now()}`,
    })
    n.onclick = () => {
      window.focus()
      n.close()
    }
  }
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useReminders() {
  const [reminders, setReminders] = useState(loadFromStorage)
  const firedRef = useRef(new Set())

  // Persist to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))

    // Also sync to Electron disk for background checker
    if (isElectron && window.electronAPI?.saveReminders) {
      window.electronAPI.saveReminders(JSON.stringify(reminders))
    }
  }, [reminders])

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Listen for play-alarm from Electron main process
  useEffect(() => {
    if (!isElectron || !window.electronAPI?.onPlayAlarm) return
    const cleanup = window.electronAPI.onPlayAlarm(() => {
      playAlarmSound()
    })
    return cleanup
  }, [])

  // In-app checker: fires when app is open
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      setReminders(prev => {
        let changed = false
        const next = prev.map(r => {
          if (r.done) return r
          const reminderTime = new Date(r.datetime).getTime()
          const diff = reminderTime - now

          // Fire window: -60s to 0 (just fired)
          if (diff <= 0 && diff > -60000 && !firedRef.current.has(r.id)) {
            firedRef.current.add(r.id)
            changed = true

            // Play sound
            playAlarmSound()

            // Show notification (web or Electron)
            if (!isElectron) {
              showWebNotification(`Jgn Lupa: ${r.title}`, r.description || 'Waktunya!')
            } else if (window.electronAPI?.markFired) {
              window.electronAPI.markFired(r.id)
            }

            return { ...r, notified: true }
          }
          return r
        })
        return changed ? next : prev
      })
    }, 10000) // check every 10s when app is open

    return () => clearInterval(interval)
  }, [])

  const addReminder = useCallback((data) => {
    const newReminder = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || '',
      datetime: data.datetime,
      category: data.category || 'personal',
      repeat: data.repeat || 'none',
      done: false,
      notified: false,
      createdAt: new Date().toISOString(),
    }
    setReminders(prev => [newReminder, ...prev])
  }, [])

  const toggleDone = useCallback((id) => {
    setReminders(prev =>
      prev.map(r => r.id === id
        ? { ...r, done: !r.done, notified: r.done ? false : r.notified }
        : r
      )
    )
  }, [])

  const deleteReminder = useCallback((id) => {
    firedRef.current.delete(id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }, [])

  const editReminder = useCallback((id, data) => {
    firedRef.current.delete(id) // allow re-fire after edit
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, ...data, notified: false } : r)
    )
  }, [])

  return {
    reminders,
    addReminder,
    toggleDone,
    deleteReminder,
    editReminder,
    CATEGORIES,
    playAlarmSound, // expose for testing
  }
}

export { CATEGORIES }
