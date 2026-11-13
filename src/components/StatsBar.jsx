import { Bell, CheckCircle2, AlertTriangle, CalendarClock } from 'lucide-react'

export default function StatsBar({ total, upcoming, done, overdue }) {
  const stats = [
    {
      label: 'Total',
      value: total,
      icon: CalendarClock,
      color: 'text-text-secondary',
      bg: 'bg-bg-card',
    },
    {
      label: 'Aktif',
      value: upcoming,
      icon: Bell,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
    },
    {
      label: 'Selesai',
      value: done,
      icon: CheckCircle2,
      color: 'text-status-done',
      bg: 'bg-status-done/10',
    },
    {
      label: 'Terlewat',
      value: overdue,
      icon: AlertTriangle,
      color: overdue > 0 ? 'text-status-overdue' : 'text-text-muted',
      bg: overdue > 0 ? 'bg-status-overdue/10' : 'bg-bg-card',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 px-4 lg:px-6 pt-4">
      {stats.map(s => {
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl px-3 py-3 flex flex-col gap-1.5 border border-white/5`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">{s.label}</span>
              <Icon size={13} className={s.color} strokeWidth={2} />
            </div>
            <span className={`text-2xl font-bold leading-none ${s.color}`}>
              {s.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}
