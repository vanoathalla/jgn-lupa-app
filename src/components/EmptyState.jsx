import { motion } from 'framer-motion'
import { BellOff, CheckCircle2, Plus } from 'lucide-react'

export default function EmptyState({ tab, onAdd }) {
  const isDone = tab === 'done'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-bg-card border border-bg-hover flex items-center justify-center mb-5">
        {isDone
          ? <CheckCircle2 size={28} className="text-text-muted" strokeWidth={1.5} />
          : <BellOff size={28} className="text-text-muted" strokeWidth={1.5} />
        }
      </div>
      <h3 className="text-text-primary font-semibold text-base mb-2">
        {isDone ? 'Belum ada yang selesai' : 'Belum ada pengingat'}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
        {isDone
          ? 'Tandai pengingat sebagai selesai dan akan muncul di sini'
          : 'Tambah pengingat pertama kamu supaya nggak ada yang kelewat'}
      </p>
      {!isDone && (
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-purple text-white text-sm font-semibold shadow-glow-sm"
        >
          <Plus size={15} strokeWidth={2.5} />
          Tambah Pengingat
        </motion.button>
      )}
    </motion.div>
  )
}
