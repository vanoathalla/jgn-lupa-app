import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Trash2, Pencil, Clock, RefreshCw, ChevronDown,
  Tag, Briefcase, Heart, ShoppingCart, MoreHorizontal,
  AlertCircle, Calendar
} from 'lucide-react'
import { formatDate, formatFullDate, getStatus } from '../utils/dateUtils'

const CATEGORY_ICONS = {
  personal: Tag,
  work: Briefcase,
  health: Heart,
  shopping: ShoppingCart,
  other: MoreHorizontal,
}

const REPEAT_LABELS = {
  none: null,
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
}

const STATUS_CONFIG = {
  done: {
    dot: 'bg-status-done',
    text: 'text-status-done',
    border: 'border-status-done/15',
    bg: '',
    icon: Check,
  },
  overdue: {
    dot: 'bg-status-overdue',
    text: 'text-status-overdue',
    border: 'border-status-overdue/25',
    bg: 'bg-status-overdue/5',
    icon: AlertCircle,
  },
  soon: {
    dot: 'bg-status-upcoming',
    text: 'text-status-upcoming',
    border: 'border-status-upcoming/20',
    bg: '',
    icon: Clock,
  },
  upcoming: {
    dot: 'bg-text-muted',
    text: 'text-text-secondary',
    border: 'border-transparent',
    bg: '',
    icon: Calendar,
  },
}

export default function ReminderCard({ reminder, categories, onToggle, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const cat = categories.find(c => c.id === reminder.category) || categories[0]
  const CatIcon = CATEGORY_ICONS[reminder.category] || Tag
  const status = getStatus(reminder.datetime, reminder.done)
  const cfg = STATUS_CONFIG[status]
  const timeLabel = formatDate(reminder.datetime)

  function handleDelete() {
    if (confirmDelete) {
      onDelete(reminder.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  return (
    <div
      className={`bg-bg-card rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-all duration-200`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">

          {/* Checkbox */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => onToggle(reminder.id)}
            className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
              reminder.done
                ? 'bg-status-done border-status-done'
                : 'border-text-muted hover:border-accent-purple'
            }`}
          >
            <AnimatePresence>
              {reminder.done && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check size={11} strokeWidth={3} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-semibold text-sm leading-snug ${
                  reminder.done ? 'line-through text-text-muted' : 'text-text-primary'
                }`}
              >
                {reminder.title}
              </h3>
              <button
                onClick={() => setExpanded(e => !e)}
                className="flex-shrink-0 text-text-muted hover:text-text-secondary transition-colors mt-0.5 p-0.5"
              >
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Category */}
              <span
                className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-lg font-medium"
                style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
              >
                <CatIcon size={10} strokeWidth={2.5} />
                {cat.label}
              </span>

              {/* Time */}
              <span className={`flex items-center gap-1.5 text-xs font-medium ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot} ${status === 'soon' ? 'animate-pulse' : ''}`} />
                {timeLabel}
              </span>

              {/* Repeat */}
              {reminder.repeat && reminder.repeat !== 'none' && (
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <RefreshCw size={10} strokeWidth={2} />
                  {REPEAT_LABELS[reminder.repeat]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-bg-hover">
                {reminder.description && (
                  <p className="text-xs text-text-secondary leading-relaxed mb-2.5">
                    {reminder.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 mb-3">
                  <Calendar size={11} className="text-text-muted" strokeWidth={2} />
                  <p className="text-xs text-text-muted">
                    {formatFullDate(reminder.datetime)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onEdit(reminder)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-hover text-text-secondary hover:text-text-primary text-xs font-medium transition-colors"
                  >
                    <Pencil size={12} strokeWidth={2} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={handleDelete}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      confirmDelete
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                        : 'bg-bg-hover text-text-secondary hover:text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    <Trash2 size={12} strokeWidth={2} />
                    {confirmDelete ? 'Konfirmasi hapus' : 'Hapus'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom accent bar */}
      {!reminder.done && (
        <div
          className="h-0.5 w-full opacity-40"
          style={{ background: `linear-gradient(90deg, ${cat.color}88, transparent)` }}
        />
      )}
    </div>
  )
}
