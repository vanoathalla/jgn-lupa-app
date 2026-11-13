import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ReminderList from './components/ReminderList'
import AddReminderModal from './components/AddReminderModal'
import EmptyState from './components/EmptyState'
import StatsBar from './components/StatsBar'
import AlarmOverlay from './components/AlarmOverlay'
import { useReminders } from './hooks/useReminders'
import { Plus } from 'lucide-react'

export default function App() {
  const {
    reminders,
    addReminder,
    toggleDone,
    deleteReminder,
    editReminder,
    CATEGORIES,
  } = useReminders()

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('upcoming')
  const [activeAlarms, setActiveAlarms] = useState([])
  const firedRef = useRef(new Set())

  // ── Alarm polling (in-app) ──────────────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      const now = Date.now()
      reminders.forEach(r => {
        if (r.done) return
        const reminderTime = new Date(r.datetime).getTime()
        const diff = reminderTime - now
        if (diff <= 0 && diff > -60000 && !firedRef.current.has(r.id)) {
          firedRef.current.add(r.id)
          setActiveAlarms(prev => {
            if (prev.find(a => a.id === r.id)) return prev
            return [...prev, r]
          })
        }
      })
    }

    check()
    const interval = setInterval(check, 10000)
    return () => clearInterval(interval)
  }, [reminders])

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = reminders.filter(r => {
    const catMatch = activeCategory === 'all' || r.category === activeCategory
    const tabMatch = activeTab === 'done' ? r.done : !r.done
    return catMatch && tabMatch
  })

  const upcomingCount = reminders.filter(r => !r.done).length
  const doneCount = reminders.filter(r => r.done).length
  const overdueCount = reminders.filter(r => !r.done && new Date(r.datetime) < new Date()).length

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleEdit(reminder) {
    setEditTarget(reminder)
    setShowModal(true)
  }

  function handleSave(data) {
    if (editTarget) {
      editReminder(editTarget.id, data)
      setEditTarget(null)
    } else {
      addReminder(data)
    }
    setShowModal(false)
  }

  function handleClose() {
    setShowModal(false)
    setEditTarget(null)
  }

  function dismissAlarm(id) {
    setActiveAlarms(prev => prev.filter(a => a.id !== id))
  }

  function doneAlarm(id) {
    toggleDone(id)
    dismissAlarm(id)
  }

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <Header onAdd={() => setShowModal(true)} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — desktop only */}
        <Sidebar
          categories={CATEGORIES}
          reminders={reminders}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          upcomingCount={upcomingCount}
          doneCount={doneCount}
          overdueCount={overdueCount}
          onAdd={() => setShowModal(true)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats bar */}
          <StatsBar
            total={reminders.length}
            upcoming={upcomingCount}
            done={doneCount}
            overdue={overdueCount}
          />

          {/* Mobile: tab + category */}
          <div className="lg:hidden px-4 pt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-accent-purple text-white shadow-glow-sm'
                    : 'bg-bg-card text-text-secondary'
                }`}
              >
                Aktif {upcomingCount > 0 && <span className="ml-1 opacity-70">({upcomingCount})</span>}
              </button>
              <button
                onClick={() => setActiveTab('done')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'done'
                    ? 'bg-status-done text-white'
                    : 'bg-bg-card text-text-secondary'
                }`}
              >
                Selesai {doneCount > 0 && <span className="ml-1 opacity-70">({doneCount})</span>}
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {[{ id: 'all', label: 'Semua', color: '#8b5cf6' }, ...CATEGORIES].map(cat => {
                const count = cat.id === 'all'
                  ? reminders.length
                  : reminders.filter(r => r.category === cat.id).length
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                      activeCategory === cat.id ? 'text-white' : 'bg-bg-card text-text-secondary'
                    }`}
                    style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.label}
                    {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-24 lg:pb-6 mt-3">
            {filtered.length === 0 ? (
              <EmptyState tab={activeTab} onAdd={() => setShowModal(true)} />
            ) : (
              <ReminderList
                reminders={filtered}
                categories={CATEGORIES}
                onToggle={toggleDone}
                onDelete={deleteReminder}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="lg:hidden absolute bottom-6 right-5 pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowModal(true)}
          className="pointer-events-auto w-14 h-14 rounded-2xl bg-accent-purple text-white flex items-center justify-center shadow-glow"
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <AddReminderModal
            onSave={handleSave}
            onClose={handleClose}
            categories={CATEGORIES}
            initial={editTarget}
          />
        )}
      </AnimatePresence>

      {/* Alarm overlay */}
      <AnimatePresence>
        {activeAlarms.length > 0 && (
          <AlarmOverlay
            alarms={activeAlarms}
            onDismiss={dismissAlarm}
            onDone={doneAlarm}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
