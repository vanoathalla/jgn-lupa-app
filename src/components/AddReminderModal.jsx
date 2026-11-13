import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X, BellPlus, Tag, Briefcase, Heart,
  ShoppingCart, MoreHorizontal, RefreshCw
} from 'lucide-react'
import { toInputDatetime } from '../utils/dateUtils'

const CATEGORY_ICONS = {
  personal: Tag,
  work: Briefcase,
  health: Heart,
  shopping: ShoppingCart,
  other: MoreHorizontal,
}

const REPEAT_OPTIONS = [
  { value: 'none', label: 'Tidak berulang' },
  { value: 'daily', label: 'Setiap hari' },
  { value: 'weekly', label: 'Setiap minggu' },
  { value: 'monthly', label: 'Setiap bulan' },
]

export default function AddReminderModal({ onSave, onClose, categories, initial }) {
  const isEdit = !!initial

  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [datetime, setDatetime] = useState(
    initial?.datetime ? toInputDatetime(initial.datetime) : ''
  )
  const [category, setCategory] = useState(initial?.category || 'personal')
  const [repeat, setRepeat] = useState(initial?.repeat || 'none')
  const [error, setError] = useState('')

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Judul wajib diisi')
    if (!datetime) return setError('Tanggal & waktu wajib diisi')
    setError('')
    onSave({
      title: title.trim(),
      description: description.trim(),
      datetime: new Date(datetime).toISOString(),
      category,
      repeat,
    })
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
      />

      {/* Panel — bottom sheet on mobile, centered dialog on desktop */}
      <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4 pointer-events-none">
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="pointer-events-auto w-full lg:max-w-md bg-bg-secondary rounded-t-3xl lg:rounded-3xl shadow-card overflow-hidden"
          style={{ maxHeight: '92vh' }}
        >
          {/* Handle — mobile */}
          <div className="flex justify-center pt-3 pb-0 lg:hidden">
            <div className="w-10 h-1 rounded-full bg-bg-hover" />
          </div>

          <div className="overflow-y-auto px-5 pb-8 pt-4" style={{ maxHeight: 'calc(92vh - 24px)' }}>
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-purple/15 flex items-center justify-center">
                  <BellPlus size={16} className="text-accent-purple" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary leading-tight">
                    {isEdit ? 'Edit Pengingat' : 'Pengingat Baru'}
                  </h2>
                  <p className="text-xs text-text-muted">Isi detail di bawah</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-bg-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Judul <span className="text-status-overdue">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Minum obat, meeting jam 2, bayar tagihan..."
                  maxLength={80}
                  autoFocus
                  className="w-full bg-bg-card border border-bg-hover rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/20 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Catatan <span className="text-text-muted font-normal">(opsional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tambah detail kalau perlu..."
                  rows={2}
                  maxLength={200}
                  className="w-full bg-bg-card border border-bg-hover rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/20 transition-all resize-none"
                />
              </div>

              {/* Datetime */}
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Tanggal & Waktu <span className="text-status-overdue">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={e => setDatetime(e.target.value)}
                  className="w-full bg-bg-card border border-bg-hover rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/20 transition-all [color-scheme:dark]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-2 block">
                  Kategori
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {categories.map(cat => {
                    const Icon = CATEGORY_ICONS[cat.id] || Tag
                    const isActive = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                          isActive
                            ? 'text-white border-transparent'
                            : 'bg-bg-card text-text-muted border-bg-hover hover:text-text-primary hover:border-bg-hover/60'
                        }`}
                        style={isActive ? {
                          backgroundColor: cat.color,
                          boxShadow: `0 0 12px ${cat.color}44`,
                        } : {}}
                      >
                        <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Repeat */}
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5 block">
                  <RefreshCw size={12} strokeWidth={2} className="text-text-muted" />
                  Pengulangan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REPEAT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRepeat(opt.value)}
                      className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                        repeat === opt.value
                          ? 'bg-accent-purple text-white border-accent-purple/50 shadow-glow-sm'
                          : 'bg-bg-card text-text-muted border-bg-hover hover:text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-status-overdue text-xs font-medium -mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-overdue" />
                  {error}
                </p>
              )}

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purpleDark text-white font-semibold text-sm shadow-glow mt-1 flex items-center justify-center gap-2"
              >
                <BellPlus size={15} strokeWidth={2.5} />
                {isEdit ? 'Simpan Perubahan' : 'Tambah Pengingat'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  )
}
