import { AnimatePresence, motion } from 'framer-motion'
import ReminderCard from './ReminderCard'

export default function ReminderList({ reminders, categories, onToggle, onDelete, onEdit }) {
  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{
              duration: 0.25,
              delay: index * 0.03,
              layout: { duration: 0.2 }
            }}
          >
            <ReminderCard
              reminder={reminder}
              categories={categories}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
