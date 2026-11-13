import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle2 } from 'lucide-react'

export default function AlarmOverlay({ alarms, onDismiss, onDone }) {
  if (!alarms || alarms.length === 0) return null

  const alarm = alarms[0] // show one at a time

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center lg:p-6 pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
          onClick={() => onDismiss(alarm.id)}
        />

        {/* Card */}
        <motion.div
          key={alarm.id}
          initial={{ y: 60, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 60, scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative pointer-events-auto w-full max-w-sm mx-4 mb-4 lg:mb-0 bg-bg-secondary rounded-3xl border border-accent-purple/30 shadow-glow overflow-hidden"
        >
          {/* Top glow strip */}
          <div className="h-1 w-full bg-gradient-to-r from-accent-purple via-accent-pink to-accent-purple animate-pulse" />

          <div className="p-5">
            {/* Icon + close */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Pulsing bell */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                  className="w-11 h-11 rounded-2xl bg-accent-purple flex items-center justify-center shadow-glow"
                >
                  <Bell size={20} className="text-white" strokeWidth={2.5} />
                </motion.div>
                <div>
                  <p className="text-xs font-semibold text-accent-purpleLight uppercase tracking-widest">
                    Pengingat
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">Sekarang</p>
                </div>
              </div>

              <button
                onClick={() => onDismiss(alarm.id)}
                className="w-7 h-7 rounded-xl bg-bg-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <h2 className="text-lg font-bold text-text-primary leading-snug mb-1">
              {alarm.title}
            </h2>
            {alarm.description && (
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {alarm.description}
              </p>
            )}

            {/* Queue indicator */}
            {alarms.length > 1 && (
              <p className="text-xs text-text-muted mb-3">
                +{alarms.length - 1} pengingat lainnya
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => onDone(alarm.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-status-done/15 border border-status-done/30 text-status-done text-sm font-semibold hover:bg-status-done/25 transition-colors"
              >
                <CheckCircle2 size={15} strokeWidth={2.5} />
                Selesai
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => onDismiss(alarm.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-hover text-text-secondary text-sm font-semibold hover:text-text-primary transition-colors"
              >
                Nanti
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
