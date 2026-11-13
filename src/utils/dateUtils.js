export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date - now

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (diff < 0) {
    const absDiff = Math.abs(diff)
    const absMins = Math.floor(absDiff / (1000 * 60))
    const absHours = Math.floor(absDiff / (1000 * 60 * 60))
    const absDays = Math.floor(absDiff / (1000 * 60 * 60 * 24))

    if (absMins < 60) return `${absMins} menit lalu`
    if (absHours < 24) return `${absHours} jam lalu`
    if (absDays === 1) return 'Kemarin'
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (minutes < 60) return `${minutes} menit lagi`
  if (hours < 24) return `${hours} jam lagi`
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Besok'
  if (days < 7) return `${days} hari lagi`

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatFullDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ' · ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function getStatus(dateStr, done) {
  if (done) return 'done'
  const diff = new Date(dateStr) - new Date()
  if (diff < 0) return 'overdue'
  if (diff < 1000 * 60 * 60) return 'soon'
  return 'upcoming'
}

export function toInputDatetime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
